const { getFips } = require('crypto');
const db = require('../Config/dbConfig');
const { exec } = require("child_process");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDjDIuoUbmqJ2D7fbx2TEcQ2yrqpnqNFg4");

const AiCode = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Missing 'query' field in request body" });
    }
    
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro-002", // The latest available stable version
      apiVersion: "v1",
    });

    const result = await model.generateContent(query);
    // console.log("Repone : ",result.response.text());
    const response = await result.response.text();

    res.json({ response });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({ error: error.message });
  }
};


const registor = (req,res) => {
  const {
    name,
    username,
    password,
    email,
    mobile,
  } = req.body;
  console.log("Data : ",req.body);

  const query = "INSERT INTO user (name,username,email,password,mobile) values (?,?,?,?,?); "

  db.query(query,[name,username,email,password,mobile],(err,results)=>{
    if(err) return res.json({success:false,message:"Database Error."});
    return res.json({success:true,message:"User Registor Successfully."});
  })

}

const login = (req,res) => {
  const {
    username,
    password
  } = req.body;
  console.log(req.body);

  const query = "SELECT * FROM user WHERE username = ? and password = ?";

  db.query(query,[username,password],(err,result)=>{
    if(err) return res.json({success:false,message:"Database Error / User Not Found."});

    if(result.length > 0)
    {
      return res.json({success:true,message:"User Login Successfully.",result : result[0]});
    }else{
      return res.json({success:false,message:"Wrong Username or Password."});
    }
    
  })
}

const getUserName = (req,res) => {
  const query = "SELECT username FROM user;"
  db.query(query,(err,result)=>{
    if(err) return res.json({success:false,message:"Database Error."});
    return res.json({success:true,message:"User List Sent.",result:result});
  })
}

const Run = (req, res) => {
    const { code, language } = req.body;
    // console.log(code)
  
    if (!code || !language) {
      return res.status(400).json({ output: "Code or language is missing!" });
    }
  
    if (language === "python") {
      const fs = require("fs");
      const path = require("path");
    
      // Create a temporary Python file
      const tempFilePath = path.join(__dirname, "tempCode.py");
      fs.writeFileSync(tempFilePath, code, "utf8");
    
      // Execute the Python file
      exec(`python ${tempFilePath}`, (error, stdout, stderr) => {
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
    
        if (error) {
          res.status(400).json({ output: stderr || "Execution error!" });
          return;
        }
        res.json({ output: stdout });
      });
    }
     else if (language === "javascript") {
      // Save the JavaScript code to a temporary file and execute it
      const fs = require("fs");
      const path = require("path");
    
      // Create a temporary file
      const tempFilePath = path.join(__dirname, "tempCode.js");
      fs.writeFileSync(tempFilePath, code, "utf8");
    
      // Execute the temporary file
      exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
    
        if (error) {
          res.status(400).json({ output: stderr || "Execution error!" });
          return;
        }
        res.json({ output: stdout });
      });
    } 
    else if (language === 'java') {
      const fs = require("fs");
      const path = require("path");
      
      const tempFilePath = path.join(__dirname, "Main.java");
      fs.writeFileSync(tempFilePath, code, 'utf8');
    
      // Compile the Java file
      exec(`javac ${tempFilePath}`, (compileError, compileStdout, compileStderr) => {
        if (compileError) {
          fs.unlinkSync(tempFilePath); // Clean up Java file
          res.status(400).json({ output: compileStderr || "Compilation Error!" });
          return;
        }
    
        // Extract the filename without extension for execution
        const className = path.basename(tempFilePath, '.java');
    
        // Execute the compiled class file
        exec(`java -cp ${__dirname} ${className}`, (execError, execStdout, execStderr) => {
          // Clean up both the Java file and the compiled class file
          fs.unlinkSync(tempFilePath);
          fs.unlinkSync(path.join(__dirname, `${className}.class`));
    
          if (execError) {
            res.status(400).json({ output: execStderr || "Execution Error!" });
            return;
          }
          res.json({ output: execStdout });
        });
      });
    }else if (language === 'c') {
      const fs = require("fs");
      const path = require("path");
      const { exec } = require("child_process");
  
      // Path for temporary C file and executable
      const tempFilePath = path.join(__dirname, "tempCode.c");
      const executablePath = path.join(__dirname, "tempExecutable");
  
      // Save the C code to a temporary file
      fs.writeFileSync(tempFilePath, code, 'utf8');
  
      // Compile the C file
      exec(`gcc ${tempFilePath} -o ${executablePath}`, (compileError, compileStdout, compileStderr) => {
          if (compileError) {
              fs.unlinkSync(tempFilePath); // Clean up C file
              res.status(400).json({ output: compileStderr || "Compilation Error!" });
              return;
          }
  
          // Execute the compiled executable file
          exec(`${executablePath}`, (execError, execStdout, execStderr) => {
              // Clean up the C file and executable
              fs.unlinkSync(tempFilePath);
              if (fs.existsSync(executablePath)) {
                  fs.unlinkSync(executablePath);
              }
  
              if (execError) {
                  res.status(400).json({ output: execStderr || "Execution Error!" });
                  return;
              }
              res.json({ output: execStdout });
          });
      });
  }
  else {
      res.status(400).json({ output: "Unsupported language!" });
    }
  };

  const SaveCode = (req,res) => {
    const {
      filename,
      language,
      code,
      id
    } = req.body;

    const query = "INSERT INTO file (name,langauge,code,uid) values (?,?,?,?);"

    db.query(query,[filename,language,code,id],(err,results)=>{
      if(err) return res.json({success : false,message : "Database error."})
      return res.json({success : true,message : "Code Saved successfully."});
    })
  } 

  const getfiles = (req,res) => {
    const id = req.body.id;
    const query = "SELECT * FROM file where uid = ?";

    db.query(query,[id],(err,result)=>{
      if(err){
        return res.json({success:false,message:"Database Error"});
      }
      return res.json({success:true,message:"Files sent",result:result});
    })
  }

  const getFileData = (req,res) => {
    const id = req.body.id;
    const query  = "SELECT * FROM file WHERE id = ?;"
    db.query(query,[id],(err,result)=>{
      if(err) return res.json({success:false,message:"Database Error",error:err});
      return res.json({success:true,message:"Data sent successefully.",result:result});
    })
  }
  const UpdateCode = (req,res) => {
    const {
      language,code,id
    } = req.body;

    const query = "UPDATE file SET code = ? ,langauge = ? where id = ?;"
    db.query(query,[code,language,id],(err,result)=>{
      if(err) return res.json({success:false,message:"Database Error",error:err});
      return res.json({success:true,message:"Code Updated successefully."});
    })
  
  }
  const UpdateFileName = (req,res) => {
    console.log(req.body)
    const {
      filename,id
    } = req.body;

    const query = "UPDATE file SET name = ? where id = ?;"
    db.query(query,[filename,id],(err,result)=>{
      if(err) return res.json({success:false,message:"Database Error",error:err});
      return res.json({success:true,message:"File Name Updated successefully."});
    })
  }
  const deleteFile = (req,res) => {
    console.log(req.body)
    const {
      id
    } = req.body;
    
    const query = "DELETE from file where id = ?;"
    db.query(query,[id],(err,result)=>{
      if(err) return res.json({success:false,message:"Database Error",error:err});
      return res.json({success:true,message:"File Delted successefully."});
    })
  }
  module.exports = {
    getUserName,
    login,
    registor,
    AiCode,
    deleteFile,
    UpdateFileName,
    UpdateCode,
    Run,
    SaveCode,
    getfiles,
    getFileData,
  }