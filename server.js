//==========VARIABLES=====================

var express=require("express");
var fileuploader=require("express-fileupload");
var mysql=require("mysql2");
var app=express();


//========APP.USE WALE ===========================
   
    app.use(express.static("Public"));
    app.use(fileuploader());
    

//===============FUNCTIONS======================

app.listen(2007,function(){
    console.log("server started");

})



//============BODY===================
app.get("/Profile",function(req,resp){

    resp.sendFile(process.cwd()+"/Public/PROFILE.html");

})


//================Database Connectivity============
var dbConfig={
    host:"127.0.0.1",
    user:"root",
    password:"imvk2004",
    database:"myProject",
    dateStrings:true
  }
  
  var dbCon=mysql.createConnection(dbConfig);
  dbCon.connect(function(jasoos){
      if(jasoos==null)
          console.log("Connected Successfulllyyy...");
          else
          console.log(jasoos);
  })

  app.post("/db-profile-submit",function(req,resp)
{
    //===============FILE UPLOADING=================================
    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        //console.log(process.cwd());
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/Public/uploads"+idpicname;
        req.files.pPic.mv(path);        
      }

     // console.log(req.body);
      //resp.send("File Name:"+idpicname);    

      //==============Saving To Database=================
      var emailid=req.body.txtEml;
      var Ename=req.body.txtName;
      var contact=req.body.txtContact;
      var address=req.body.txtAddress;
      var city=req.body.txtCity;
      var dob=req.body.txtDob;
      var gender=req.body.txtGender;
      var id=req.body.txtId;
      
      
      //fixed                             //same seq. as in table
    dbCon.query("insert into profile(emailid,name,contact,address,city,dob,gender,id,idpicname) values(?,?,?,?,?,?,?,?,?)",[emailid,Ename,contact,address,city,dob,gender,id,idpicname],function(err)
    {
          if(err==null)
            resp.send("Record Saved Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          else
            resp.send(err);
    })

})

//============INDEX SIGNUP================================================================================================================
app.get("/insert-info", function (req, resp) {

    dbCon.query("insert into users1(email,password,type,dos,status) values(?,?,?,current_date(),1)", [req.query.kuchemail, req.query.kuchpwd, req.query.kuchtype], function (err) {
        if (err == null)
            resp.send("saved successfully");
        else
            console.log(err.message);
    })

})

//============EMAIL CHECK====================================================================================================================
app.get("/chk-email", function (req, resp) {

    dbCon.query("select * from users1 where email=?", [req.query.kuchemail], function (err, resultTable) {
        if (err == null) {
            if (resultTable.length == 1) {
                resp.send("email id already taken");
            }
            else {

                resp.send("available");
            }
        }
        else {
            resp.send(err);
        }
    })
})
//=========login wala==========
app.get("/search-info", function (req, resp) {

    dbCon.query("select * from users1 where email=? and password=?", [req.query.email, req.query.password], function (err, resutltablejason) {

        if (err == null) {
            if (resutltablejason.length == 1) {
                if (resutltablejason[0].status == 0) {
                    resp.send("you have been blocked by the admin");
                }
                else {
                    resp.send(resutltablejason[0].type);
                }
            }
        }
        else
            resp.send(err);
    })
})

//========SETTINGSS---------UPDATE PASSWORD========================================================================================================
app.get("/update-info-settings", function(req,resp){
   
    dbCon.query("select * from users1 where email=?", [req.query.kuchemail], function (err, resultTableJSON) {
        if (err == null) {
            if(resultTableJSON.length==1)
            {
                if(req.query.kucholdpwd==req.query.kuchnewpwd)
                {
                    resp.send("Old and new password should not be same");
                }
                else if(req.query.kuchnewpwd!=req.query.kuchconpwd)
                {
                    resp.send("Confirm and new password should be same");
                }
                else{
                    dbCon.query("update users1 set password=? where email=?", [req.query.kuchnewpwd,req.query.kuchemail], function (er) { 
                        if(er==null)
                        {
                            resp.send("record updated");
                        }
                        else
                        {
                            resp.send(er);
                        }
                })
            }
            }
        }
        else
            resp.send(err);
    })

})

    //=====Setting-WALA-EMAIL-CHECKERR=================================================================================
    app.get("/chk-email-to-up-pwd", function (req, resp) {

        dbCon.query("select * from users1 where email=?", [req.query.kuchemail], function (err, resultTable) {
            if (err == null) {
                if (resultTable.length == 1) {
                    resp.send(" ");
                }
                else {

                    resp.send("InValid EmAIL");
                }
            }
            else {
                resp.send(err);
            }
        })
    })


//================================================================================================================================================
//================================================================================================================================================
//===========SAVE--DONOR--PROFILE=================================================================================================================
app.post("/save-donor-profile",function(req,resp)
{
    //===============FILE UPLOADING=================================
    //console.log(req.body.txtEmail);
   // console.log(req.body.txtType);
    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        //console.log(process.cwd());
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/Public/uploads/"+idpicname;
        req.files.pPic.mv(path);        
      }

     // console.log(req.body);
      //resp.send("File Name:"+idpicname);    

      //==============Saving To Database=================

      var ahours= req.body.time1+" to "+req.body.time2;
      //console.log(ahours);
      //console.log("filename");
    dbCon.query("insert into donors(email,name,contact,address,city,id,filename,ahours) values(?,?,?,?,?,?,?,?)", [req.body.txtEmail, req.body.txtName, req.body.txtMobile, req.body.txtAddress, req.body.txtCity, req.body.txtType,idpicname,ahours], function (err) {
        
        if (err == null){
           //console.log("mai pass me hu");
            resp.send("saved successfully");
        }
        else
        {

            //console.log(err);
            //resp.send(err);
        }
    })
})
//===========SAVE--NEEDY--PROFILE=================================================================================================================
app.post("/needy-save-profile",function(req,resp)
{
    //===============FILE UPLOADING=================================
    console.log("hello");
   // console.log(req.body.txtType);
    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        //console.log(process.cwd());
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/Public/uploads/"+idpicname;
        req.files.pPic.mv(path);        
      }

     // console.log(req.body);
      //resp.send("File Name:"+idpicname);    

      //==============Saving To Database=================

      //var ahours= req.body.time1+" to "+req.body.time2;
      //console.log(ahours);
      //console.log("filename");
    dbCon.query("insert into needy(email,name,contact,address,city,filename,DOB,gender) values(?,?,?,?,?,?,?,?,?)", [req.body.txtEmail, req.body.txtName, req.body.txtMobile, req.body.txtAddress, req.body.txtCity,idpicname,req.body.dob,req.body.txtGender], function (err) {
        
        if (err == null){
           //console.log("mai pass me hu");
            resp.send("saved successfully");
        }
        else
        {

            //console.log(err);
            //resp.send(err);
        }
    })
})

//================================================================================================================================================
//================================================================================================================================================
//===========UPDATE--DONOR--PROFILE===============================================================================================================
app.post("/update-donor-profile",function(req,resp)
{
//================FILE UPLOADING====================================
    //console.log(req.body.txtEmail);
   // console.log(req.body.txtType);
    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        //console.log(process.cwd());
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/Public/uploads/"+idpicname;
        req.files.pPic.mv(path);        
      }

//==============Saving To Database===================================
      var ahours= req.body.time1+" to "+req.body.time2;
      //console.log(ahours);
      //console.log("filename");
    dbCon.query("update donors set name=?,contact=?,address=?,city=?,id=?,filename=?,ahours=? where email=?", [req.body.txtName, req.body.txtMobile, req.body.txtAddress, req.body.txtCity, req.body.txtType,idpicname,ahours,req.body.txtEmail], function (err) {
        
        if (err == null){
           //console.log("mai pass me hu");
            resp.send("saved successfully");
        }
        else
        {
            //console.log(err);
            resp.send(err);
        }
    })
})

//===========UPDATE--NEEDY--PROFILE===============================================================================================================
app.post("/update-needy-profile",function(req,resp)
{
//================FILE UPLOADING====================================
    //console.log(req.body.txtEmail);
   // console.log(req.body.txtType);
    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        //console.log(process.cwd());
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/Public/uploads/"+idpicname;
        req.files.pPic.mv(path);        
      }

//==============Saving To Database===================================
      var ahours= req.body.time1+" to "+req.body.time2;
      //console.log(ahours);
      //console.log("filename");
    dbCon.query("update donors set name=?,contact=?,address=?,city=?,filename=?,DOB=?,gender=? where email=?", [ req.body.txtName, req.body.txtMobile, req.body.txtAddress, req.body.txtCity,idpicname,req.body.dob,req.body.txtGender,req.body.txtEmail], function (err) {
        
        if (err == null){
           //console.log("mai pass me hu");
            resp.send("saved successfully");
        }
        else
        {
            //console.log(err);
            resp.send(err);
        }
    })
})


//================================================================================================================================================


//================================================================================================================================================
//================================================================================================================================================
//===================NEEDY-PROFILE================================================================================================================
app.get("/save-needy-profile", function (req, resp) {

    //===============FILE UPLOADING=================================
    var filename="nopic.jpg";
    if (req.files != null) {
        filename = req.files.pPic.name;
        var path = process.cwd() + "/MY PROJECT/uploads" + filename;
        req.files.pPic.mv(path);
    }

    dbCon.query("insert into needy(email,name,contact,address,city,gender,DOB,filename) values(?,?,?,?,?,?,?,?)", [req.query.emailid, req.query.name, req.query.mob, req.query.address, req.query.city,req.query.gender, req.query.dob,req.query.img], function (err) {
        
        if (err == null){
             //console.log("mai pass me hu");
            resp.send("saved successfully");
        }
        else
        {
            //console.log(err);
            resp.send(err); 
        }
    })

})

//=================================================================================================================================================
//===========AVAILABLE-MEDICINES===================================================================================================================
app.get("/save-available-medicines", function (req, resp) {

    dbCon.query("insert into medsavailable(email,med,expdate,packing,qty) values(?,?,?,?,?)", [req.query.email, req.query.med, req.query.expdate, req.query.packing, req.query.qty], function (err) {
        
        if (err == null){
             //console.log("mai pass me hu");
            resp.send("saved successfully");
        }
        else
        {
        //console.log(err);
            resp.send(err); 
        }
    })

})
//================================================================================================================================================
//================================================================================================================================================
//==================DONOR PROFILE-SEARCH BUTTON===================================================================================================
    app.get("/get-json-record",function(req,resp){

        dbCon.query("select * from donors where email=?",[req.query.Email],function(err,resultTableJSON){

            if(err==null)
                resp.send(resultTableJSON);
            else
                resp.send(err);
        })
    })
//================================================================================================================================================
//================================================================================================================================================
//==================NEEDY PROFILE-SEARCH BUTTON===================================================================================================
app.get("/get-json-record",function(req,resp){

    dbCon.query("select * from needy where email=?",[req.query.Email],function(err,resultTableJSON){

        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

//====================================================DONOR-PAGE WALA KAAM========================================================================================================
//==================FETCH MEDICINES RECORDS============================================================================================================
app.get("/get-angular-all-med-records",function(req,resp)
{ 
         //fixed                             //same seq. as in table
         //console.log(req.query.email);
    dbCon.query("select * from medsavailable where email=?",[req.query.email],function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

//===========DELETE-MEDICINE-FROM MED MANAGER=========================================================================================================================
app.get("/do-del-med",function(req,resp)
{
    var srno=req.query.srno;

    dbCon.query("delete from medsavailable where srno=?",[srno], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Medicine Not Deleted");
          else
          resp.send("Medicine Deleted Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          }
            else
          resp.send(err);
    })
})

//==================FIND MEDICINE----NEEDY PAGE WALA KAAM==========================================================================================================================================
//==================FETCH CITY RECORDS============================================================================================================
app.get("/get-angular-all-city",function(req,resp)
{ 
         //fixed                             //same seq. as in table
         //console.log(req.query.email);
    dbCon.query("select distinct city from donors",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//=========================FETCH MEDINICES-FOR NEEDY PAGE============================================
app.get("/get-angular-all-Med",function(req,resp)
{ 
         //fixed                             //same seq. as in table
         //console.log(req.query.email);
    dbCon.query("select distinct med from medsavailable",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

//========================ALL-REQUIRED-RECORDS============================================================================================================
app.get("/get-angular-all-Required-Records",function(req,resp)
{ 

    var med=req.query.medname;
    var city=req.query.cityname;
    

    dbCon.query("select donors.name,donors.email,donors.ahours,donors.contact,donors.address,donors.city,donors.id,donors.filename,medsavailable.med from donors inner join medsavailable on donors.email=medsavailable.email where med=? and city=?",[med,city],function(err,resultTableJSON)
    {
        if(err==null){
            console.log("hello");
            resp.send(resultTableJSON);
        }
        else{
            resp.send(err);
            console.log("hello");   
        }
    })

})





















//================================================================================================================================================
//================================================ADMIN WALA KAAMMMMMM===============================================================================================

//====================================================ALL USERSSSSS========================================================================================================
//==================ADMIN FETCH RECORDS============================================================================================================
app.get("/get-angular-all-records",function(req,resp)
{ 
         //fixed                             //same seq. as in table
    dbCon.query("select * from users1",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//===========BLOCK-PROFILE=========================================================================================================================
app.get("/do-block-account",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("update users1 set status=0 where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Account Blocked Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          }
            else
          resp.send(err);
    })
})
//===========RESUME-PROFILE=========================================================================================================================
app.get("/do-resume-account",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("update users1 set status=1 where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Account Resumedddd Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          }
            else
          resp.send(err);
    })
})

//====================DONORS WALA ADMIN PAGE==============================================================================================================
//=================FETCH-DONOR- RECORDS============================================================================================================
app.get("/fetch-all-donors",function(req,resp)
{ 
         //fixed                             //same seq. as in table
    dbCon.query("select * from donors",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//===========DELETE-PROFILE=========================================================================================================================
app.get("/do-dlock-account-donor",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("delete from donors where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Profile Deleted Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          }
            else
          resp.send(err);
    })
})

//====================NEEEDYYYYYYYYYYY WALA ADMIN PAGE==============================================================================================================
//=================FETCH-NEEDY- RECORDS============================================================================================================
app.get("/fetch-all-needy",function(req,resp)
{ 
         //fixed                             //same seq. as in table
    dbCon.query("select * from needy",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//===========DELETE-PROFILE-needy=========================================================================================================================
app.get("/do-dlock-account-needy",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("delete from needy where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Profile Deleted Successssfullllyyyyyyyyyyyyyyyyyyyyyyyy!!!!!!!!!");
          }
            else
          resp.send(err);
    })
})
