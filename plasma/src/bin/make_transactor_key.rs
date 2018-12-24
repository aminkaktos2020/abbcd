extern crate rand;
extern crate pairing;
extern crate sapling_crypto;
extern crate ff;
extern crate hex;
extern crate crypto;
extern crate plasma;
extern crate time;
extern crate bellman;

use time::PreciseTime;

use pairing::bn256::*;
use rand::{OsRng};
use sapling_crypto::alt_babyjubjub::{AltJubjubBn256};

use bellman::groth16::{
    generate_random_parameters,
};

use plasma::vk_contract_generator::{generate_vk_contract};

use plasma::models::params as plasma_constants;
use plasma::circuit::transfer::transaction::{Transaction};
use plasma::circuit::leaf::{LeafWitness};
use plasma::circuit::transfer::circuit::{TransactionWitness, Transfer};

const TRANSFER_BATCH_SIZE: usize = 8;
const FILENAME: &str = "transfer_pk.key";
const CONTRACT_FILENAME: &str = "TransferVerificationKey.sol";
const CONTRACT_NAME: &str = "TransferVerificationKey";
const CONTRACT_FUNCTION_NAME: &str = "getVkTransferCircuit";

fn main() {
    // let p_g = FixedGenerators::SpendingKeyGenerator;
    let params = &AltJubjubBn256::new();
    // let rng = &mut XorShiftRng::from_seed([0x3dbe6258, 0x8d313d76, 0x3237db17, 0xe5bc0654]);
    let rng = & mut OsRng::new().unwrap();

    let empty_transaction = Transaction {
        from: None,
        to: None,
        amount: None,
        fee: None,
        nonce: None,
        good_until_block: None,
        signature: None
    };

    let empty_leaf_witness = LeafWitness {
        balance: None,
        nonce: None,
        pub_x: None,
        pub_y: None,
    };

    let empty_witness = TransactionWitness {
        leaf_from: empty_leaf_witness.clone(),
        auth_path_from: vec![None; plasma_constants::BALANCE_TREE_DEPTH],
        leaf_to: empty_leaf_witness,
        auth_path_to: vec![None; plasma_constants::BALANCE_TREE_DEPTH],
    };

    let instance_for_generation: Transfer<Bn256> = Transfer {
        params: params,
        number_of_transactions: TRANSFER_BATCH_SIZE,
        old_root: None,
        new_root: None,
        public_data_commitment: None,
        block_number: None,
        total_fee: None,
        transactions: vec![(empty_transaction, empty_witness); TRANSFER_BATCH_SIZE],
    };

    println!("generating setup...");
    let start = PreciseTime::now();
    let tmp_cirtuit_params = generate_random_parameters(instance_for_generation, rng).unwrap();
    println!("setup generated in {} s", start.to(PreciseTime::now()).num_milliseconds() as f64 / 1000.0);

    use std::fs::File;
    use std::io::{BufWriter, Write};
    {
        let f = File::create(FILENAME).expect("Unable to create file");
        let mut f = BufWriter::new(f);
        tmp_cirtuit_params.write(& mut f).expect("Unable to write proving key");
    }

    use std::io::{BufReader};

    let f_r = File::open(FILENAME).expect("Unable to open file");
    let mut r = BufReader::new(f_r);
    let circuit_params = bellman::groth16::Parameters::<Bn256>::read(& mut r, true).expect("Unable to read proving key");

    let contract_content = generate_vk_contract(&circuit_params.vk, CONTRACT_NAME.to_string(), CONTRACT_FUNCTION_NAME.to_string());

    let f_cont = File::create(CONTRACT_FILENAME).expect("Unable to create file");
    let mut f_cont = BufWriter::new(f_cont);
    f_cont.write_all(contract_content.as_bytes()).expect("Unable to write contract");
    
    println!("Done");
}