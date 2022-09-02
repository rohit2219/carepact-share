
import rimraf from 'rimraf'
import path from 'path'
import fs from 'fs'
import moment from 'moment'


function deleteimage (){

            const __dirname = path.resolve();
            var uploadsDir = __dirname + '/uploads/SocketImg';

            fs.readdir(uploadsDir, function(err, files) {
                console.log(files)
            files.forEach(function(file, index) {
                fs.stat(path.join(uploadsDir, file), function(err, stat) {
              
                if (err) {
                    return console.error(err);
                }
                const now=moment()
                const endTime=moment(stat.birthtimeMs).add(30,'days')
          
                console.log(file+" now time =",now)
                console.log(file+" end time =",endTime)
                if (now > endTime) {
                    return rimraf(path.join(uploadsDir, file), function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(`${file} => successfully deleted`);
                    });
                }
                });
            });
            });

}

export { deleteimage };