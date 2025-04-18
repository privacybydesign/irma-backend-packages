import type { Jwt, JwtPayload, PrivateKey, Secret } from "jsonwebtoken";

// Requests
type AttributeTypeIdentifier =
  | string
  | {
      type: string;
      notNull?: boolean;
      value?: string | null;
    };
type AttributeCon = AttributeTypeIdentifier[];
type AttributeDisCon = AttributeCon[];
type AttributeConDisCon = AttributeDisCon[];

type BaseRequest = {
  labels?: {
    [key: string]: {
      [key: string]: string;
    };
  };
};

type DisclosureRequest = BaseRequest & {
  "@context": "https://irma.app/ld/request/disclosure/v2";
  disclose: AttributeConDisCon;
};

type SignatureRequest = BaseRequest & {
  "@context": "https://irma.app/ld/request/signature/v2";
  message: string;
  disclose: AttributeDisCon;
};

type Credential = {
  credential: AttributeTypeIdentifier;
  validity?: number;
  attributes: {
    [key: string]: string;
  };
};

type IssuanceRequest = BaseRequest & {
  "@context": "https://irma.app/ld/request/issuance/v2";
  credentials: Credential[];
  disclose?: AttributeDisCon;
};

type SessionRequest = DisclosureRequest | SignatureRequest | IssuanceRequest;

type ExtendedSessionRequest = {
  validity?: number;
  timeout?: number;
  callbackUrl?: string;
  request: SessionRequest;
};

declare class IrmaJwt {
  constructor(
    method: "publickey" | "hmac",
    options?: {
      secretKey?: Secret | PrivateKey;
      iss?: string;
    }
  );
  signSessionRequest(request: SessionRequest | ExtendedSessionRequest): string;
  verify(jwt: string): Jwt | JwtPayload | string;
}

export = IrmaJwt;
