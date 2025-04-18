type SessionStatus = {
  Initialized: "INITIALIZED";
  Connected: "CONNECTED";
  Cancelled: "CANCELLED";
  Done: "DONE";
  Timeout: "TIMEOUT";
};
type SessionStatusType = SessionStatus[keyof SessionStatus];

type SessionToken = string;
type SessionPtr = {
  u: string;
  irmaqr: string;
};

type SessionPackage = {
  token: SessionToken;
  sessionPtr: SessionPtr;
};

type StateChangeCallback = (
  error: null | Error,
  status?: SessionStatusType
) => void;

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

// Responses
type SessionType = "disclosing" | "signing" | "issuing";
type ProofStatus =
  | "VALID"
  | "INVALID"
  | "INVALID_TIMESTAMP"
  | "UNMATCHED_REQUEST"
  | "MISSING_ATTRIBUTES"
  | "EXPIRED";
type AttributeProofStatus = "PRESENT" | "EXTRA";
type SignedMessage = {
  "@context": string;
  signature: string;
  indices: [];
  nonce: string;
  context: string;
  message: string;
  timestamp: string;
};
type RemoteError = {
  status?: number;
  error?: string;
  description?: string;
  message?: string;
  stacktrace?: string;
};
type SessionResult = {
  type: SessionType;
  status: SessionStatusType;
  disclosed?: [
    [
      {
        status: AttributeProofStatus;
        rawvalue: string;
        id: AttributeTypeIdentifier;
        value: {
          [key: string]: string;
        };
        issuancetime: string;
        notrevoked?: boolean;
        notrevokedbefore?: string;
      }
    ]
  ];
  signature?: SignedMessage;
  error?: RemoteError;
  proofStatus?: ProofStatus;
  token: SessionToken;
};

// Options
type SessionStateOptions = {
  debugging?: boolean;
  serverSentEvents?: {
    url: (options: SessionStateOptions) => string;
    timeout?: number;
  };
  polling?: {
    url: (options: SessionStateOptions) => string;
    interval?: number;
    startState?: boolean;
  };
};

declare class IrmaBackend {
  static SessionStatus: SessionStatus;
  constructor(
    serverUrl: string,
    options?: {
      debugging?: boolean;
      serverToken?: string;
    } & SessionStateOptions
  );
  startSession(
    request: string | SessionRequest | ExtendedSessionRequest
  ): Promise<SessionPackage>;
  cancelSession(sessionToken: SessionToken): Promise<void>;
  getSessionResult(sessionToken: SessionToken): Promise<SessionResult>;
  getSessionResultJwt(sessionToken: SessionToken): Promise<string>;
  getSessionStatus(sessionToken: SessionToken): Promise<{
    status: SessionStatusType;
  }>;
  getServerPublicKey(): Promise<string>;
  subscribeStatusEvents(
    sessionToken: SessionToken,
    eventCallback: StateChangeCallback
  ): void;
}

export = IrmaBackend;
