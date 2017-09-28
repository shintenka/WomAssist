exports.getDeployFile = function(filename){
  filename = filename.replace(/.js/,'');
  return {
    region: 'ap-northeast-1',
    handler: filename + '.handler',
    role: 'arn:aws:iam::347867041416:role/Internship2016-APIStudy-LambdaRole',
    functionName: filename,
    timeout: 10,
    runtime: 'nodejs6.10'
  }
}
