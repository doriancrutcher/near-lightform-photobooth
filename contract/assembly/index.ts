/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, storage, PersistentMap} from 'near-sdk-as'

const DEFAULT_MESSAGE = 'Hello'

// Exported functions will be part of the public interface for your smart contract.
// Feel free to extract behavior to non-exported functions!

const slideTool= new PersistentMap<string, i32>('tool to set the current slides')

export function setSlide(slideNumber:i32):void{
  if(slideTool.contains("slide")){
    slideTool.set("slide",slideNumber);

  }else{
    slideTool.set("slide",slideNumber);
  }
}

export function getSlide():i32{
  if(slideTool.contains("slide")){
    return slideTool.getSome("slide");

  }else{
    logging.log('no slides have been initiated yet, defaulting to first slide')
   return 0
    }
}

export function incrementParticipation():void{
  let newCounter = storage.getPrimitive<i32>("Counter",0)+1;
  storage.set("counter",newCounter);
  logging.log("we added another NEAR participant. That's now "+newCounter.toString());
}

export function getTotal(): i32 {
  return storage.getPrimitive<i32>("counter", 0);
}

export function resetTotal(): void {
  storage.set<i32>("counter", 0);
  logging.log("We've not reset participation total.")
}