import React, { useEffect, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Toast } from 'bootstrap';

// import bootstrap from 'bootstrap'

export default function App() {
  const [users,setusers]=useState([])
  const[newname,setnewname]=useState("")
  const[newemail,setnewemail]=useState("")
  const[newwebsite,setnewwebsite]=useState("")

  useEffect(()=>{
    setTimeout(()=>{
        fetch("https://jsonplaceholder.typicode.com/users")
    .then((res)=>res.json())
    .then((data)=> setusers(data))
    .catch((err)=>console.log(err))
    },1000)
    

  },[])

   function showToast(message, type = "success") {
  const toastEl = document.getElementById("myToast");

  if (!toastEl) return;

  toastEl.className = `toast text-bg-${type}`;
  toastEl.querySelector(".toast-body").innerText = message;

  const toast = new Toast(toastEl, { delay: 2000 });
  toast.show();
}

  function adduser() {
  const name = newname.trim();
  const email = newemail.trim();
  const website = newwebsite.trim();

  if (!name || !email || !website) {
    showToast("Please fill all fields!", "warning");
    return;
  }

  fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    body: JSON.stringify({ name, email, website }),
    headers: {
      "Content-Type": "application/json; charset-UTF-8"
    }
  })
    .then((res) => res.json())
    .then(() => {
  const newUser = {
     id: users.length ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    website
  };

  setusers([...users, newUser]);

  showToast("User added successfully!", "success");

  setnewname("");
  setnewemail("");
  setnewwebsite("");
})
    .catch((err) => {
      console.log(err);
      showToast("Error adding user!", "danger");
    });
}


function onchange(id,key,value){
    setusers(()=>{
      return  users.map(user=>{
          return  user.id ===id ? {...user, [key]:value}:user;
        })
    })
}


function updatefunction(id) {
  const user = users.find(user => user.id === id);

  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json; charset-UTF-8"
    }
  })
    .then((res) => res.json())
    .then(() => {
      showToast("User Updated successfully!", "success");
    })
    .catch((err) => {
      console.log(err);
      showToast("Error updating user!", "danger");
    });
}

  return (
    <>
    <div>
            {/* {users&& <h1 style={{textAlign:"center"}}>Loading...</h1>} */}
      <table className='table m-5 p-3 gap-4 '>
        <thead>
            <tr>
        <th>ID</th>
        <th>NAME</th>
        <th>Email</th>
        <th>Website</th>
        <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {users.map(user =>
          <tr key={user.id}>
            <td >{user.id}</td>
            <td>{user.name}</td>
            <td contentEditable suppressContentEditableWarning={true} onChange={value=>onchange(user.id,"email",value)}>{user.email}</td>
            <td contentEditable suppressContentEditableWarning={true} onChange={value=>onchange(user.id,"website",value)}>{user.website}</td>
            <td><button className='btn btn-secondary gap-2' onClick={()=>updatefunction(user.id)}>Update</button><button className='btn btn-danger'>Delete</button></td>
          </tr>
        )}
        </tbody>
        <tfoot>
            <tr>
                <td></td>
                <td><input type="text" value={newname} onChange={(e)=>setnewname(e.target.value)} placeholder='Enter Name' /></td>
                <td><input type="text" value={newemail} onChange={(e)=>setnewemail(e.target.value)} placeholder='Enter Email' /></td>
                <td><input type="text" value={newwebsite} onChange={(e)=>setnewwebsite(e.target.value)} placeholder='Enter Website' /></td>
                <td><button className='btn btn-success' onClick={adduser}>ADD NEW USER</button></td>
            </tr>
        </tfoot>
      </table>
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
  <div id="myToast" className="toast align-items-center border-0">
    <div className="d-flex">
      <div className="toast-body">
        Message here
      </div>
      <button
        type="button"
        className="btn-close me-2 m-auto"
        data-bs-dismiss="toast"
      ></button>
    </div>
  </div>
</div>
    </div>
    </>
  )
}
