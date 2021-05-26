const getConfig = require("./src/config.js");
const nearlib = require("nearlib");
const osc = require("osc");
// const unencrypted_file_system_keystore_1 = require("./key_stores/unencrypted_file_system_keystore");

class HackTheThon {
  constructor() {
    this.lightformIP = process.argv[2];
    console.log(this.lightformIP);
    this.timedGrabber = this.timedGrabber.bind(this);
    this.timedGrabber();
    this.lastCheckedVal = null;
    this.totalSlides = process.argv[2];
    this.udpPort = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 57119,
      metadata: true,
    });
    this.udpPort.open();
    // this.udpPort = osc.UDPPort({
    //   localAddress: this.lightformIP,
    //   localPort: 8000,
    //   metadata: true
    // })
  }
  // lastCheckedVal = 'something'

  async grabbit() {
    // trying

    // let keyStore = new nearlib.keyStores.InMemoryKeyStore();

    /*
    working
    const keyStore = new nearlib.keyStores.UnencryptedFileSystemKeyStore('./neardev');
    const key = await keyStore.getKey(getConfig().networkId, getConfig().contractName);
    console.log('key', key);
    // keyStore.setKey(getConfig().networkId, getConfig().contractName, nearlib.KeyPair.fromString(params.get('privateKey')));
    keyStore.setKey(getConfig().networkId, getConfig().contractName, nearlib.KeyPair.fromString(key.secretKey));
    // nearConfig.deps = { keyStore };
    
    const near = await nearlib.connect(Object.assign({ deps: { keyStore} }, getConfig()));
    // const near = await nearlib.connect(Object.assign({ deps: { keyStore: new nearlib.keyStores.UnencryptedFileSystemKeyStore() } }, getConfig()));
    let account = await new nearlib.Account(near.connection, getConfig().contractName)
    const contract = await new nearlib.Contract(
      account,
      getConfig().contractName, {
        viewMethods: ["getTotal"],
        changeMethods: ["incrementParticipation", "resetTotal"],
        sender: getConfig().contractName
      }
    );    
    // call contract to reset
    await contract.resetTotal();
     */

    // on terminal if we wish to increase it manually:
    // from somewhere like `near-lightform`
    // near call jankcity incrementParticipation --accountId=jankcity

    // const contract = await near.loadContract(getConfig().contractName, {
    //   viewMethods: ["getTotal"],
    //   changeMethods: ["incrementParticipation", "resetTotal"],
    //   sender: getConfig().contractName
    // })
    // contract.resetTotal();

    // get wallet account - needed to access wallet login
    // const walletAccount = new nearlib.WalletAccount(near);
    // console.log('walletAccount: ', walletAccount);
    // console.log('near: ', near);
    // /trying

    const provider = new nearlib.providers.JsonRpcProvider(
      getConfig("mainnet").nodeUrl
    );

    const nonsensicalResult = await provider.query(
      `call/${getConfig("mainnet").contractName}/getSlide`,
      "AQ4"
    ); // Base 58 of '{}', yall
    const sensicalResult = JSON.parse(
      nonsensicalResult.result.map((x) => String.fromCharCode(x)).join("")
    );
    if (this.lastCheckedVal !== sensicalResult) {
      console.log(`new result came in sensicalResult: ${sensicalResult}`);
      this.lastCheckedVal = sensicalResult;
      this.sendOSC(
        parseFloat(this.lastCheckedVal) % parseFloat(this.totalSlides)
      );
    }

    console.log(sensicalResult);
  }

  sendOSC(slideNum) {
    console.log("changing to slide (hopefully float): ", slideNum);
    this.udpPort.send(
      {
        // address: '/next',
        address: "/slide",
        args: {
          type: "f",
          value: slideNum,
        },
      },
      this.lightformIP,
      8000
    );
  }

  async timedGrabber() {
    await this.grabbit();
    if (this.timer !== null) {
      this.timer = setTimeout(this.timedGrabber, 1000);
    }
  }
}

new HackTheThon();
