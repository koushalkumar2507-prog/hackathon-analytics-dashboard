async function loginUser(){

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const msg =
    document.getElementById("login-msg");


  // Validation
  if(!email || !password){

    msg.innerText =
      "Please fill all fields";

    return;
  }


  try{

    // API Request
    const response = await fetch(

      "http://localhost:5000/api/auth/login",

      {

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          email,
          password

        })

      }

    );


    const data = await response.json();

    console.log(data);


    // LOGIN SUCCESS
    if(data.success){

      // Save token
      localStorage.setItem(
        "token",
        data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      msg.style.color = "#4ade80";

      msg.innerText =
        "Login successful";


      // Redirect after login
      setTimeout(()=>{

        window.location.href =
          "index.html";

      },1000);

    }

    // LOGIN FAILED
    else{

      msg.innerText =
        data.message || "Login failed";

    }

  }

  catch(error){

    console.error(error);

    msg.innerText =
      "Server error";

  }

}