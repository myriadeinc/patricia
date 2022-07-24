'use strict';

const BlockReference = require('../src/block.reference.js');
const xmrlib = require('../src/util/xmr.js')


const config = require('../src/util/config.js');
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-string'))
  .should();

describe('Unit tests for Block Referencing', ()=> {

  const job = { 
    minerId: 'dsafj-234',
    job_id: '824614c3f225f36daf6676c76a2eb7952f935a4cf3',
    extraNonce: 1927639731,
    height: 2093893,
    seed_hash: 'b7535e4ee43bbc3efbb8191719f76c7fb187c06994b3ea84106a6072accfe5e2',
    blob: '0c0cd9f4d5f505aedf21d5e8917e52c7881a4415c58451adfcd0d74552cb29edee530d79dea3af000000000281e77f01ffc5e67f01cf97e5e8d731026a9f71bf3713c68276996b9c08c62cd3cd329838ea64298673a39a54d7fcf4bb2b01297e8c1df560254249bbac8275c1322f721ffb167602388b6d4da1237e8edb960208000000000000000000120e3cc18eabd7fbd67a9b118d34022f884ecb420bd95682ebc04279c5bbdaf71308b5dfbaed7e30836b5628d5a1083c65c921c71d94065697356e6cb798b5212b4768d6e54931f283749b968c43ff79b79b5317031c451f940002365b448a45381fe0e0d7f71927b5f58ed18f7e2da8565d884b4a1f16e1c29ec02d9622059179656bcb6a31cfe81318f9bc5a71f6dc6d536c88a96a638e1dd908d707ce6d817d33ec3abd608275316c1221c7bc49855b357fdd5014ba75c0cc6158eaa74f2c78e83836a530599ef63ce853eda7b3378a040b5756da626e4daf86315cfa78dd9b815d8639679e7deb4f110ca2721525082ddff7c6042b8cd2d2ef8fd6db22ffd9a415a4c821cbe8d7b16cc34f43652cdc25caa169e37ea3ad82e3371ffc5fa5da0982e1f3cd8e2c48f8983554383cc1b2b00a44e78460624a8e7a633b1b4ea182efcc3da4555de127243ed3845045c5dc5ae5f40562844f06755423786f609fa21eb3acb46066942cc94c938cced3bfe19197686f8e4ca6855ca3fccafbf2ea3ff2b20bc531625d6e50840ed50bf2d038e67f02cab624325c619e0c46e1b6a8fb654eb728d4fe75dd227b6eb33fe935e8df6a4fcc64be60b3f411bb26b7b2a72fbeb8f77a28e8d49ed0f5f130124da7d26f785e6e34522ec07b6c97988fc9d5c4abf4571a7f251fa8c7cb560cd0dfd2e308227819e937c732015b26b15fe7e562feeca2ccf582ea5595001616786942dab65b1041d57f9d65ae7a71dc6847eb962d89953eb2cb2d9a7829b8bc6614c28b28ca9f77e9f4603790cc7d2f0fbe315a',
    globalDiff: 152217110269,
    difficulty: '8000' 
  };
  const minerData = {
    id: 'dsafj-234',
    job_id: '824614c3f225f36daf6676c76a2eb7952f935a4cf3',
    nonce: '34210000',
    result: '0c456307f6681606439dcfebfa890473d10dc85fdadf3da4909b9e1838380000'
  };
  
  it('Should verify that a miner submitted block is valid', () => {
    const truth = BlockReference.verifyBlock(
        job.blob,
        minerData.nonce,
        job.extraNonce,
        job.seed_hash,
        minerData.result        
        );
    truth.should.be.equal(true);
  });

  it('Should verify the difficulty of a block', () => {
    const localDiff = 8000;
    const block = minerData.result;
    const globalDiff = 152217110269;
    const status = BlockReference.checkDifficulty(localDiff, globalDiff, block)
    status.should.be.equal(2);
  });

  it('Should verify a block that won the reward', () => {
    const blob = '0c0cb0d2d6f5051a3facd8db3e16eb5a16392d74a75f96087873062fc8cc640baeb9f84d6e466af980020002e5e77f01ffa9e77f01dbd5fdead931026a663ed2c7eabd2e82e7588e7d39d1d54f62cb7e274b7c2ead3769fc28e4249234018e3f89559e77c87c06ce425fa01cfedf3cafffb158e754642d0a07dd7f2a89c20211000032e2586ccc57000000000000000000002339abed4f8da491176e8097a655e1efb8fd0f8c6a38fd2e447e5a5f25151b9736d7331454919a1c346091011a571c1e71ee59d3502f68d9e2de6ea6d4fb8ae7408382225360a0d0dd54a7290cb6c58805d2a79ecd9164d4c66b3211950ed29e29c4d8ef4521cc1876a86efcb693078921abd01feba2697da3c60c959f6436b6d0516c649487305d14a9d8908031603448eaa3c2d6c993bc745ee9796334d971ffba67eb23ad8ce5399c553e30f77a2ce423b312ff485627400bfb56a80229035589017b5fe49c4203a1fcc9b86d54ea3b12fca091b1540a32493cf1850039e51f37df50d97016fc02528ae6ca8b7126fd855b9e87337f913cbc34e25d8dcb0e0ecf9a5bc516d2efc85e1349d93ed4c4f654617a2ec5fdb7fab680a9fc4c9e0463dda645947b4c2c062fb22b73e3cda7717a16ab368d8a174407bc5b306e5d51a7dbc69a7d901d5cc61a7f2c8f071feac1d1f5ac99a41757efd64a8db9e52d98fe569d39f1034b2b6957b9816bf9ebf344966535805a7fa4cefd24b7316fbc42d00db0a974353c0c6ec8b65b05b88e3833f85ccc480e6e683eca65387aa5b5c31de65e310fb35132f08d6c2ff36def0b12dd8985dbb1a302b07b23fe3a0ed30e1744d34e28c950453bc65cd2c0ba92cd4c4a2ab7970739c7adc7b8937a6bdff947c92de3bac446de976595c487d251ebb94141ffb37f3764e0dd97aea764d47c8f9c38cfffa5d8577f7c7517ee2b9764d65b98ffaeec17e809a8d88fa965e91baa6bb9bb1ae2fe13b63d69813bda21c13ac5155eda48e81c4d73f0b97b22402b467be0c8b0fbfc2f5929cfcb589ad8f01ddec76996bd7d8cea33eac86b763277259acadae8b50b9d622b4380b8c4d6b9dae9ce99e21f3a696535c1ecd9a06682672e73af5c3523bb630dce7f89f31434365dfd6794dd8499d8fbfc9a71fc5123ec674a964193f9b8bf16b53ffe8d46022cfd1408c90c373549c6ecd2e7eaaf184e62946802a5366ada2b6c9f86f357df7c3bfc2ab4aadd8cf4b68409cf1e34cd5408886f30da18bf68ce7fd23d09368abf5459a331959ec9131d811745d440c9db0cddaeae713793cc3c8cbcdca018ab513b96405864749ec86690b773c1565f062f6d01e49c59b2f400dd61d7b44e3095150c8bdd2dceaf0cdc6b9b8054ca6535e2569e21c57bb176022ea0805cf4e28bb053a803fa7eff0dd0cd5a595625473e0d82ad0a720cbcf0a1cabe736cb03a79314857c1d0d8171ed878f12873587b7295e13813e2b3563dcab40912e8be812853365f6f36ac54e9fd7da6c8580f7509dda1d6e7fe2762cc7feecaeeda2f257fb82d219bd939156a19fce0073bffd5ae21ab46478e71c978d8cc963391e9a268763a5b5d975b08b547203cfed25da326c98b6060ce8694248462c46d3d97be28fa17552c13d1fb800a372f56b2168c4da058fc285c7abcfd22ad02d9b71624dc7a824cacae18cd1f3e973fe07f9e655fc4d54064e5510bc21cb0b1dbc987cabd64b5225263b9ab62ceccd75517efd7405fe6cd140f2d58b2f7f492337d00130b92dda269f4da7852be037815e9ebb83e';
    const globalDiff = '148085610848'; // -> ~2^38
    const nonce = 164089;
    const seed_hash = "b7535e4ee43bbc3efbb8191719f76c7fb187c06994b3ea84106a6072accfe5e2";
    let block  = BlockReference.buildIntNonce(blob, nonce);
    block = BlockReference.convertBlock(block);
    block = BlockReference.hashBlock(block, seed_hash);
    const result = BlockReference.checkDifficulty(globalDiff, globalDiff, block.toString('hex'));
    result.should.be.equal(3);
    
  });

  it('Should parse a new blocktemplate blob', () => {
    const param = {
      "miner":"3c09f837-6b29-4482-a66b-c250b8ac5640",
      "templateBlob":"1010e3968d9a068a9b05afc57d1912ebd1c142af708ef8bde5f1280fe88315db1a373d235d99df0000000002b8d0a60101fffccfa6010180f9d5d3f7130370a046ee1fdd97a46736650c33977f69d50fd53db055aea73c4d964e5987e5aeb12b01578c618e14e1a87844936da965ff11c9d95f7f254fd3c498ea50e9068fe6d29102080000000000000000004cff32de2b237889a039b163a42a5019b2e34602853d4fecd0b9df196db3dd47a3a66b206b9057be18a45ce1cbe69067ed1c951f8e05949caed7276d9fb49a890bc5bddd6c5df6149dfed112e5a55071ca457cff11e17fb983eea1aeec8c74bb3abf70a8c2452941d9fe126511c970bcff9ac82533780db68156ba2f5dc4815c1bd0a2472aed127153f76349617e6370b5562df495aac73e00040bcf968c9dd4d576a15247d5e767f682df78f8716ee3f49cb4996c8898b70fba84a62dd3780a7a31dfdb2b9fde3513040ae92b618d4dad9b00bfa8924b8a446e37da34fc36ae2d5772cfd4f2d5df456ac32363cd9dd0be820eb240252cd3d70bb90f5804a928665d55502ac39fc46c53a595bc6631707d94d8a836f5b19f9315bc2c7434b2798cb6032711c5579258adcf36024f69e07ec87c9d674135f33cb28ea6ba9045624eeacb96eb315c9a3767840eef404548ac27518a0118bfbf63636a705cc7d16e4bb8b04d69077571db11441d464959e70c9e58fbc04379cb910b50ba32e624846e74e4f3d63dd40172a1955a6cd2d82c73d44d8e0463ffca888e90962d46035078139f681525e38644dc59eea66b54ce0f3f629f7e42c7bc1d4e785f3bd9cd439ed739d78809751447272706120ec82f67fdcf8e07a0e23f47ce854137679eff785436a0d311d45e4f82ddd470908bfed4decfbe14524bd536878b5a86daab78d3112ce4b69618ff70a2de43c0a11764730e692117aa3f8e754d1fce439c4acb1486770a4f5026065c6828a0bcc057928b18ebe355531eb3e2c7fd99f5cdc03e222fb65a1c138c99d96c22686238b0ebabf9d0e532344bcb311f6e495ba37e42155cd5a6050ad803562b24bb7ebfced12978bb4f0f19ffd9e5ef121a38272f055d85b6df23c568086ab317502acf89b3f5daa3d58d092745d344ffe8823de6d32a4df4971461528da65b0aee921310ad63b39a50c61bdad871b0d0dd0b0274bebcc0d317f9270bc860fef45c97f574ceafb80d176cca7995e0442a6d8e47eb8a89d04848511de1c288fab34d725058f37ba6cd2cfd0e7283e26d6867bab7ab32394b09ce5bb6745fe64aecc3df908d2d83243ffcebea84c17536456c0c9880014b48f647f2fa0df8c208f5f517305bcbedfa7e95e9a188da8870879b72f3b491de3e89670d2fc91043cd894a146117b1f258e464bb0eebdd2224ee51baf4a75879d6580be8179cead09ae1f55435053e09afa6ddadd9e374d90fdd9e1d25d1a5b96e8b4a4e67b1aa0c75bd75c337784ecfeaf76d7d83e5af124d8086f6bfde448bb9ffef4e812c0e03df43bfd8ea1db56e42f52397e412f2b3522c13ea96658a5d259b6caaa405d68d54d078ab4c1a6f10f7843bae86402b416e4b393965c8769b98f2914bcc96014d5fcf6a1eea18d88dafb40d9b7ce57946b5028751e5ad44b543de5f1319f0418073c599c92113d0b5df5f5d081cfcdf617f4f3814deaefa9de3b562680c71e780949043ec9883b5f88d416b5693c351b900d1dd25d2305ed77e52b43d26e047e6535767cb6af8984f5bcd89e752b69587a7995e268b6eace192504d80095e3223280fd4fc86ac1bb551dbdaf5c3becd1ad825b10b510794264bac3d9fc79129c4cae8e3ccaf3d58f764898b3b8324ae2b94184b70310cb5a2f845f041c10c18045c39b1a38aeceb1c75d48c94125eee25a7db6f1aac5e2165413e73d3d5f158be5d3221dbae9cae770e801746b3663f5d1f7fd319238989f086cc6ec3ea68430abfe5cb1cae0633dd75b80bee15ee0dbf94270cd12c2b13a1494d4fa5b8b6c2f1bcb9c64c5f4de0495d23926010882851ff621e153364bf28227d5b70d8ee0080eab83cacddddd26ada14436215e1400aff25ba4e43b0b7c1e5e294a1b4417486161c92a80c75cd42ce874a1740518c35f8ee7491f0d55ccb467d1fa4fdc8e4c50153f21ac6f466f2c132d09c25a84cccbec6be87713bd8d92f6aa749f0560d985ccd295cf5eae02bd1f335197c7a135317cc0e7a6a42d524b5c1d9f641d00bcb01ab19762cbe9a43e6f78d7f93fe1d1628a3468e294ffe1433bec605539bffad5d18c4d4f9d4454e21d299fa475221489da51e7061af2f5797a4826f2758b4d2dd8a1f26b4be98aef264e4a05e2030767cb066b8eb390f6999cdcf69c19a76ff18b90cbd38cfc9fd908169817520304de628a46d2d2a934f9592e9f5cec65d08d81f562c9162c1c8b56e14e807378cb277cdbb330baba1d99fd73b23d4b1063f310fd69f81f1e80f21cba28a1881671b3661c1733ddb5030e0209a344e795bedf95b684835a7788ebd459554b00723e004fea9a19c2d2ce87254f378d15f70c8fadb4bbb85abcce162b9027c388802dfdd38d33fe755a8c2efdc60cbe1c23a75f389ba28e49a473481710ce2fac75f5572441a883f727128998f26eba26e72e08f604f1a17ca8376c14289d22ed9c1cd765c12f5b0d70ea65513209e27e0d924c32461831dccfbd44f68b132350fca3e03fa5228c34d47b29e906518504054878c10562ef82e28eda86724fbf20d939aeba4d4b2fd40fb8163295b024352c4f3a2ee0e77e426f1e2174e86dcdca2f898b55a81e223fd94fe1beb55e359f6b5064a145b9d5a624e14aea0a2bd6bc9d6f8068dd7d788add422fbab995d41db1a0d0dca9b2742963600a37418a21ae9c7d9cc01ece1092f4276f2d8ed177606ee31ae7119dd050bb71cec1c5cbe77ad368f4c3129556e27d21c016a87396900cdd855bac63684e7b875ebff72540fbb12a0d5168f9ec3ff63d917e445961ebc517bdb65f285adf0e053ffe1477d5dec6ea95be71715acedd6ca921819f2b53fe9dc9b48ea57f1d8c4ced9329865eb3f6b6f80fa5f19cf86cefa412ff948da1b3c647801f442bf253e24019f02a199c8935b249d54ab23841a6a68b38975e347ba0e844d86425de042969c4f1f6afada7c6bd0f20dc7d25096517631af729194825f7045188fb397678f4676a9f631ac59c9323b9e8872ba29876d53af9e356e81b9f40c903c51ca91235a85edbe1da2d260a9ce0410f571f5e403afb853e006313dd8e4972eb584dc6d82c5cf1d2f7330ebff56baf8521c65d1ccb4da2cd71a78f574b205b3169751bec6be3321ce9f0b67803cb06b4e91cb35fc071b6f5edce4af9f43d76179a430aea40e9f3c3c490b8627bdab917b7a77717b15368f15a1872d03a56834d517cacecfaba8f8d184673d36f2aaaca74df9fd48b672207e04fa24a0d505d2b52fb867956acaffc07360a80f30f97247329f505bfd8a4aa536103d81058e983893262e970900874a95f42a9b29b450a01e6598997ee8951848243b836f984e710d28e9273cda5fb316884bfee3e04773bc9a66fa16d97c30e96ac2098d9bbd0f7501c2839579f725fc2663540d672ab3b5446d",
      "templateDiff":"315857875147",
      "templateHeight":"2729980",
      "templateSeedhash":"c5264d11fdf2b11d8791d733c10c4537e9a0156fc107cc583ad54ca38258fb22"
    }
    const blob = Buffer.from(param.templateBlob, "hex")
    blob.writeUInt32BE(1927639731, 8);
    const minerBlob = xmrlib.convert_blob(blob).toString("hex")
    minerBlob.should.be.equal("1010e3968d9a068a72e572b37d1912ebd1c142af708ef8bde5f1280fe88315db1a373d235d99df00000000021e5c0ca6a6ca229ba0a72c5b7027bfa3bbcb326c844db160c03820e5516ebd4d");

  });



//     it('Should verify that a miner submitted block is valid', () => {
//     const truth = false;
//     truth.should.be.equal(true);
//   });
})