function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toast-container");
  
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
  
    const icon = document.createElement("span");
    icon.classList.add("icon");
  
    // Set the icon based on the toast type
    switch (type) {
      case "success":
        icon.innerHTML = '<i class="fa fa-check-circle"></i>'; // Check-circle for success
        break;
      case "error":
        icon.innerHTML = '<i class="fa fa-times-circle"></i>'; // Times-circle for error
        break;
      case "warning":
        icon.innerHTML = '<i class="fa fa-exclamation-triangle"></i>'; // Exclamation-triangle for warning
        break;
      default:
        icon.innerHTML = '<i class="fa fa-info-circle"></i>'; // Default info icon
    }
  
    // Append the icon and message to the toast
    toast.appendChild(icon);
    toast.appendChild(document.createTextNode(message));
  
    // Append the toast to the container
    toastContainer.appendChild(toast);
  
    // Automatically remove the toast after 4 seconds
    setTimeout(() => {
      toast.remove();
    }, 4000);
  }
  