// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class TokenListed extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenListed entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenListed must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenListed", id.toString(), this);
    }
  }

  static loadInBlock(id: string): TokenListed | null {
    return changetype<TokenListed | null>(
      store.get_in_block("TokenListed", id)
    );
  }

  static load(id: string): TokenListed | null {
    return changetype<TokenListed | null>(store.get("TokenListed", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get isActive(): boolean {
    let value = this.get("isActive");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isActive(value: boolean) {
    this.set("isActive", Value.fromBoolean(value));
  }
}

export class TokenSaleCancelled extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenSaleCancelled entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenSaleCancelled must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenSaleCancelled", id.toString(), this);
    }
  }

  static loadInBlock(id: string): TokenSaleCancelled | null {
    return changetype<TokenSaleCancelled | null>(
      store.get_in_block("TokenSaleCancelled", id)
    );
  }

  static load(id: string): TokenSaleCancelled | null {
    return changetype<TokenSaleCancelled | null>(
      store.get("TokenSaleCancelled", id)
    );
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }
}

export class TokenSold extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save TokenSold entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type TokenSold must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("TokenSold", id.toString(), this);
    }
  }

  static loadInBlock(id: string): TokenSold | null {
    return changetype<TokenSold | null>(store.get_in_block("TokenSold", id));
  }

  static load(id: string): TokenSold | null {
    return changetype<TokenSold | null>(store.get("TokenSold", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }
}
