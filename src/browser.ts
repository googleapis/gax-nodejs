import { Gaxios } from "gaxios";

export {
    CallSettings,
    constructSettings,
    RetryOptions
  } from './gax';

export {createApiCall} from './createApiCall';
  
export function foo() {return 42;}

export class GrpcClient {
    loadProto() {}
    constructSettings() {}
    createStub() {}
};

