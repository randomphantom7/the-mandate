var express = require('express');
var router = express();

var ejs = require('ejs');


const path = require('path');

router.set('views', path.join(__dirname, 'views'));
router.set('view engine', 'ejs');

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/student_home', function(req, res) {    
    // console.log('SHOW student_home');
    res.render('student_home');
});

router.get('/apply_council', function(req,res){
     res.render('apply_council');
});

router.get('/applycr',function(req,res){
    res.render('applycr');
});

router.get('/teacher_login',function(req,res){
   res.render('teacher_login');
});

router.get('/applycr',function(req,res){
    res.render('applycr');
    });

    router.get('/result',function(req,res){
        // console.log("hiii");
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
        MongoClient.connect(url,function(err,db){
            if(err) throw err;
            var dbo = db.db("mandate_database");
            var check = dbo.collection("verified_student").find().sort({votes:-1}).toArray(function(err,result){
                        if(err) throw err;
                        console.log(result);
                        res.render('result',{result});
            });
        });
        
        });
    
    router.post('/result',function(req,res){
        res.json({});
        });
        
router.get('/approval', function(req,res){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var check = dbo.collection("cr_application_student").find({}).toArray(function(err,result){
                    if(err) throw err;
                    res.render('approval',{result});
        });
    });
});

router.post('/approval',function(req,res){
      res.json({});
});


router.post('/approved_for_cr',function(req,res){
     var reg = req.body.regno;
     var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        dbo.collection("cr_application_student").findOne({regno:reg}, function(err, result) {
            if (err) throw err;
           dbo.collection("verified_student").insertOne(result,function(err,re){
               if(err) throw err;
               dbo.collection("cr_application_student").deleteOne({regno:reg}, function(err,result){
                if(err) throw err;
                 res.json({submit:"true"});
               });
           });
        });
    });

});

router.post('/increase_vote',function(req,res){
    var reg = req.body.regno;
    var regn = req.body.voter_regno;
    var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
   MongoClient.connect(url,function(err,db){
       if(err) throw err;
       var dbo = db.db("mandate_database");
       dbo.collection("verified_student").updateOne({regno:reg},{ "$inc": { votes: 1} } ,function(err, result) {
           if (err) throw err;
           dbo.collection("students").updateOne({regno : regn},{"$set":{"voted":"true"}},function(req,resul){
           if (err) throw err;
               res.json({voted:"true"});
           });
       });
   });
});




router.post('/not_approved_for_cr',function(req,res){
    var reg = req.body.regno;
    var MongoClient = require('mongodb').MongoClient;
   var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
   MongoClient.connect(url,function(err,db){
       if(err) throw err;
       var dbo = db.db("mandate_database");
       dbo.collection("cr_application_student").deleteOne({regno:reg}, function(err, result) {
           if (err) throw err;
            res.json({submit:"true"});
       });
   });

});

router.post('/teacher_login', function(req,res){
    var user_name=req.body.user;
    var pass=req.body.password;
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        dbo.collection("teachers").findOne({mail:user_name}, function(err, result) {
            if (err) throw err;
            // console.log(result);
            if(result.password===pass)
            {
                res.json({login:"true"});
            }
            else{
                res.json({login:"false"});
            }
            db.close();
        });
    });
});

router.get('/vote',function(req,res){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var check = dbo.collection("verified_student").find({}).toArray(function(err,result){
                    if(err) throw err;
                    res.render('vote',{result});
        });
    });
});




router.post('/vote',function(req,res){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var check = dbo.collection("students").findOne({regno:req.body.regno} , function(err,result){
                    if(err) throw err;
                    if(result.voted === "false")
                    { 
                        res.json({canvote : "true"}); 
                    }
                    else
                    {
                        res.json({canvote:"false"});
                    }
        });
    });
});

router.post('/check_for_cr', function(req,res){
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var check = dbo.collection("verified_student").findOne({regno:req.body.regno} , function(err,result){
                    if(err) throw err;
                    if(result)
                    { 
                        res.json({applied : "true"}); 
                    }
                    else
                    {
                        res.json({applied:"false"});
                    }
        });
    });
});


router.post('/savedetail', function(req,res){
    var student = req.body;
    // console.log(student);
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var check = dbo.collection("cr_application_student").findOne({regno:student.regno} , function(err,result){
                    if(err) throw err;
                    if(result)
                     res.json({applied : "true"});
                 else
                {
                        dbo.collection("verified_student").findOne({regno:student.regno},function(req,re){
                            if(err) throw err;
                            if(re)
                            res.json({applied : "true"});
                          else
                        {
                            var ans = dbo.collection("cr_application_student").insertOne(student, function(err,result){
                                if(err) throw err;
                                res.json({applied:"false"});
                            });
                        }
                    });
                }
        });
    });
    
});

router.post('/savedetailcouncil', function(req,res){
    var student = req.body;
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var check = dbo.collection("council_application_student").findOne({regno:student.regno} , function(err,result){
                    if(err) throw err;
                    if(result)
                     res.json({applied : "true"});
                    else
                    {
                        var ans = dbo.collection("council_application_student").insertOne(student, function(err,result){
                            if(err) throw err;
                            res.json({applied:"false"});
                        });
                    }
        });
    });
    
});



router.post('/filldatacouncil', function(req,res){
    var reg = req.body.regno;
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var ans = dbo.collection("verified_student").findOne({regno:reg}, function(err,result){
            if(err) throw err;
            res.json(result);
        });
    });
});

router.post('/filldata', function(req,res){
    var reg = req.body.regno;
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url,function(err,db){
        if(err) throw err;
        var dbo = db.db("mandate_database");
        var ans = dbo.collection("students").findOne({regno:reg}, function(err,result){
            if(err) throw err;
            res.json(result);
        });
    });
});

router.post('/student_home',function(req,res){
    // console.log('hii');
    var user_name=req.body.user;
    var pass=req.body.password;
    var MongoClient = require('mongodb').MongoClient;
    // console.log("hiii");
    var url = "mongodb+srv://akshaj:akshaj123@mandatedatabase-pt9kd.mongodb.net/test?retryWrites=true&w=majority";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        // console.log("hiii");
        var dbo = db.db("mandate_database");
        dbo.collection("students").findOne({regno:user_name}, function(err, result) {
            if (err) throw err;
            if(result)
            {
            if(result.password===pass)
            {
                res.json({login:"true"});
            }
            else{
                res.json({login:"false"});
            }
           }
           else{
            res.json({login:"false"});
           }
            db.close();
        });
      });
});


module.exports = router;