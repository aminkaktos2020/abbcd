
import {BigNumber} from "ethers/utils";
import {utils as syncutils} from "zksync";
import {BN} from "bn.js";

export function createDepositPublicData(tokenId, hexAmount: string, franklinAddress: string): Buffer {
    const txId = Buffer.from("01", "hex");
    const accountId = Buffer.alloc(3, 0);
    accountId.writeUIntBE(2, 0, 3);
    const tokenBytes = Buffer.alloc(2);
    tokenBytes.writeUInt16BE(tokenId, 0);
    if (hexAmount.startsWith("0x")) {
        hexAmount = hexAmount.substr(2);
    }
    const amountBytes = Buffer.from(hexAmount, "hex");
    const pad1BytesLength = 16 - amountBytes.length;
    const pad1Bytes = Buffer.alloc(pad1BytesLength, 0);
    if (franklinAddress.startsWith("0x")) {
        franklinAddress = franklinAddress.substr(2);
    }
    const addressBytes = Buffer.from(franklinAddress, "hex");
    const pad2Bytes = Buffer.alloc(6, 0);

    return Buffer.concat([txId, accountId, tokenBytes, pad1Bytes, amountBytes, addressBytes, pad2Bytes]);
}

export function createWrongDepositPublicData(tokenId, hexAmount: string, franklinAddress: string): Buffer {
    const txId = Buffer.from("01", "hex");
    const accountId = Buffer.alloc(3, 0);
    accountId.writeUIntBE(2, 0, 3);
    const tokenBytes = Buffer.alloc(2);
    tokenBytes.writeUInt16BE(tokenId, 0);
    if (hexAmount.startsWith("0x")) {
        hexAmount = hexAmount.substr(2);
    }
    const amountBytes = Buffer.from(hexAmount, "hex");
    const pad1BytesLength = 14 - amountBytes.length;
    const pad1Bytes = Buffer.alloc(pad1BytesLength, 0);
    if (franklinAddress.startsWith("0x")) {
        franklinAddress = franklinAddress.substr(2);
    }
    const addressBytes = Buffer.from(franklinAddress, "hex");

    return Buffer.concat([txId, accountId, tokenBytes, pad1Bytes, amountBytes, addressBytes]);
}

export function createWithdrawPublicData(tokenId, hexAmount: string, ethAddress: string): Buffer {
    const txId = Buffer.from("03", "hex");
    const accountId = Buffer.alloc(3, 0);
    accountId.writeUIntBE(2, 0, 3);
    const tokenBytes = Buffer.alloc(2);
    tokenBytes.writeUInt16BE(tokenId, 0);
    if (hexAmount.startsWith("0x")) {
        hexAmount = hexAmount.substr(2);
    }
    const amountBytes = Buffer.from(hexAmount, "hex");
    const pad1BytesLength = 16 - amountBytes.length;
    const pad1Bytes = Buffer.alloc(pad1BytesLength, 0);
    const feeBytes = syncutils.packFeeChecked(new BN("0"));
    if (ethAddress.startsWith("0x")) {
        ethAddress = ethAddress.substr(2);
    }
    const addressBytes = Buffer.from(ethAddress, "hex");
    const pad2Bytes = Buffer.alloc(4, 0);

    return Buffer.concat([txId, accountId, tokenBytes, pad1Bytes, amountBytes, feeBytes, addressBytes, pad2Bytes]);
}

export function createFullExitPublicData(accId, ethAddress: string, tokenId, hexAmount: string): Buffer {
    const txId = Buffer.from("06", "hex");
    const accountId = Buffer.alloc(3, 0);
    accountId.writeUIntBE(accId, 0, 3);
    const pubkeyBytes = Buffer.alloc(32, 0);
    if (ethAddress.startsWith("0x")) {
        ethAddress = ethAddress.substr(2);
    }
    const addressBytes = Buffer.from(ethAddress, "hex");
    const tokenBytes = Buffer.alloc(2);
    tokenBytes.writeUInt16BE(tokenId, 0);
    const nonceBytes = Buffer.alloc(4, 0);
    const signatureBytes = Buffer.alloc(64, 0);
    if (hexAmount.startsWith("0x")) {
        hexAmount = hexAmount.substr(2);
    }
    const amountBytes = Buffer.from(hexAmount, "hex");
    const pad1BytesLength = 16 - amountBytes.length;
    const pad1Bytes = Buffer.alloc(pad1BytesLength, 0);
    const pad2Bytes = Buffer.alloc(2, 0);

    return Buffer.concat([
        txId,
        accountId,
        pubkeyBytes,
        addressBytes,
        tokenBytes,
        nonceBytes,
        signatureBytes,
        pad1Bytes,
        amountBytes,
        pad2Bytes
    ]);
}

export function createNoopPublicData(): Buffer {
    const txId = Buffer.from("00", "hex");
    const padBytes = Buffer.alloc(7, 0);

    return Buffer.concat([txId, padBytes]);
}

export function createWrongNoopPublicData(): Buffer {
    const txId = Buffer.from("00", "hex");
    const padBytes = Buffer.alloc(6, 0);

    return Buffer.concat([txId, padBytes]);
}

export function createWrongOperationPublicData(): Buffer {
    const txId = Buffer.from("07", "hex");
    const padBytes = Buffer.alloc(7, 0);

    return Buffer.concat([txId, padBytes]);
}

export function hex_to_ascii(str1) {
	const hex = str1.toString();
	let str = "";
	for (let n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}
