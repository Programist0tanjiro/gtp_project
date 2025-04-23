function toggleSlide() {
    const slider = document.getElementById("slider");
    slider.style.transform = slider.style.transform === "translateX(-50%)" ? "translateX(0)" : "translateX(-50%)";
  }
  
  function register() {
    const user = document.getElementById("regUser").value.trim();
    const pass = document.getElementById("regPass").value.trim();
  
    if (!user || !pass) {
      alert("Fill both fields.");
      return;
    }
  
    let users = JSON.parse(localStorage.getItem("users")) || [];
  
    const exists = users.some(u => u.username === user);
    if (exists) {
      alert("Username taken, pick another.");
      return;
    }
  
    users.push({ username: user, password: pass });
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Registered! Now log in.");
    toggleSlide();
  }
  
  function login() {
    const user = document.getElementById("loginUser").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
  
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.username === user && u.password === pass);
  
    if (found) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("loggedUser", user);
      window.location.href = "main-site.html";
    } else {
      alert("Wrong username or password.");
    }
  }
  