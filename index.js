var sharp = require('sharp');
var express = require('express');
var fileUploader = require('express-fileupload');
var path = require('path');
var moment = require('moment');
var randomstring = require('randomstring')
var async = require("async")

var app = express();

require('shelljs/global')

app.use('/static',express.static(path.join(__dirname,'web')))
app.use(fileUploader())
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname,'web/index.html'))
})

function resizeImage(folder,parentCallback) {
  async.series([
    function(callback) {
      sharp(folder+"/image.png").resize(72,72).toFile(folder+"/ic_launcher_hdpi.png",function(err,info) {
        if(err)
          console.error(err);
      });
      callback(null,"hdpi done")
    },
    function(callback) {
      sharp(folder+"/image.png").resize(48,48).toFile(folder+"/ic_launcher_mdpi.png",function(err,info) {
        if(err)
          console.error(err);
      });
      callback(null,"mdpi done")
    },
    function(callback) {
      sharp(folder+"/image.png").resize(96,96).toFile(folder+"/ic_launcher_xhdpi.png",function(err,info) {
        if(err)
          console.error(err);
      });
      callback(null,"xhdpi done")
    },
    function(callback) {
      sharp(folder+"/image.png").resize(144,144).toFile(folder+"/ic_launcher_xxhdpi.png",function(err,info) {
        if(err)
          console.error(err);
      });
      callback(null,"xxhdpi done")
    }
  ],
  function(err,results) {
    parentCallback()
  })
}

app.post('/upload',function(req,res) {
  var appname = req.param('appname')
  console.log(appname)
  var file = req.files.iconFile
  var folder = randomstring.generate(8)
  var android_icon_dir = "android/app/src/main/res/"
  exec("mkdir "+folder)
  file.mv(folder+"/image.png", function(err){
    if(!err) {
        resizeImage(folder,function() {
          async.series([
            function(callback) {
              console.log("Executing Task Set App Name")
              console.log(exec("gulp set_app_name --appname "+appname))
              callback(null,"Task 1 completed")
            },
            function(callback) {
              console.log(mv('-f','temp/template.js','index.android.js'))
              console.log(mv('-f','temp/package-template.json','package.json'))
              callback(null,"Task 2 completed")
            },
            function(callback) {
              console.log("Executing Task React-Native Upgrade")
              console.log(exec("react-native upgrade"))
              callback(null, "Task Upgrade completed")
            },
            function(callback) {
              console.log(android_icon_dir)
              exec("mv -f "+folder+"/ic_launcher_hdpi.png "+android_icon_dir+"mipmap-hdpi/ic_launcher.png",function(code, stdout, stderr){
                if(stderr)
                  console.error(stderr)
                else {
                  console.log(stdout)
                }
              })
              exec("mv -f "+folder+"/ic_launcher_mdpi.png "+android_icon_dir+"mipmap-mdpi/ic_launcher.png",function(code, stdout, stderr){
                if(stderr)
                  console.error(stderr)
                else {
                  console.log(stdout)
                }
              })
              exec("mv -f "+folder+"/ic_launcher_xhdpi.png "+android_icon_dir+"mipmap-xhdpi/ic_launcher.png",function(code, stdout, stderr){
                if(stderr)
                  console.error(stderr)
                else {
                  console.log(stdout)
                }
              })
              exec("mv -f "+folder+"/ic_launcher_xxhdpi.png "+android_icon_dir+"mipmap-xxhdpi/ic_launcher.png",function(code, stdout, stderr){
                if(stderr)
                  console.error(stderr)
                else {
                  console.log(stdout)
                }
              })
              console.log("Moved Icons")
              callback(null,"Icons Moved")
            },
            function(callback) {
              console.log("Building APK")
              exec("./android/gradlew -p android assembleRelease")
              callback(null,"APK Builded")
            },
            function(callback) {
              console.log("Moving APK to release folder")
              exec("mkdir -p web/"+folder+" && mv -f android/app/build/outputs/apk/app-release-unsigned.apk "+"web/"+folder+"/"+"appname"+".apk")
              callback(null,"APK Moved")
            }
          ], function(err,info) {
              if(err) {
                console.error("\n\n\n\nError Occured")
                console.error(err)
                res.sendStatus(500)
              }
              else {
                console.log(info)
                // exec("gulp clean --folder "+folder)
                res.render('upload',{link:"static/"+folder+"/"+appname+".apk"})
              }
          })
        })
      exec("gulp clean --folder "+folder)
    }
    else{

      res.sendStatus(500)
    }
  })
})

app.listen(3000, function(){
  console.log("Application listening on port 3000")
})
