// exports.renameToCID = functions.storage.bucket('art-planet.appspot.com')
// .object().onFinalize(async (object) => {
//   console.log('listened');
//    console.log(object);
// const bucket = admin.storage().bucket();
// const file = bucket.file(object.name);
// const data = await file.download({
//    destination: object.name,
// validation: false
// });
// // console.log(data)
//  const bytes = dagPB.encode({Data: new UnixFS.UnixFS({type:'file',
// data: data.pop()}).marshal(),Links:[]});
// console.log(bytes);

// const hash = await sha2.sha256.digest(bytes);

// const cid = multiformats.CID.createV0(hash);
// // console.log('cid: ' + cid.toString());
// if(cid.toString().localeCompare(file.name)){
// await file.rename(cid.toString());
// }
// });
