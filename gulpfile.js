var replace = require('gulp-replace');
var gulp = require('gulp')
require('shelljs/global')

gulp.task('set_app_name',function(){
  var option,i = process.argv.indexOf("--appname");
  if(i>-1){
    option = process.argv[i+1]
  }
  console.log(option)
  gulp.src(['template.js'])
    .pipe(replace('{TemplateApp}',option))
    .pipe(gulp.dest("temp"))
  gulp.src(['package-template.json'])
    .pipe(replace('{TemplateApp}',option))
    .pipe(gulp.dest("temp"))
})

gulp.task('clean',function(){
  var option,i = process.argv.indexOf("--folder");
  if(i>-1){
    option = process.argv[i+1]
  }
  console.log(rm('-rf','__tests__'))
  console.log(rm('-rf',option))
  console.log(rm('-rf','android'))
  console.log(rm('-rf','ios'))
  console.log(rm('-rf','temp'))
  console.log(exec('rm index.android.js'))
  console.log(exec('rm package.json'))
})
