document.addEventListener("DOMContentLoaded", function () {
    const latestFive = usersData.slice(0, 5); // Get the latest 5 users

    // Get the dropdown element where the users will be injected
    const dropdown = document.getElementById("messageDropdown");

    // Loop through the latest 5 users and add them to the dropdown
    latestFive.forEach((user) => {
      dropdown.innerHTML += `
        <li style="padding: 10px; margin: 0; list-style: none;">
            <a href="#">
                <img alt="" class="img-msg img-circle" src="${user.userImage}" />
                ${user.name} <b>${user.timeAgo}</b><br />
                <small>${user.description}</small>
            </a>
        </li>
        <li class="divider"></li>
    `;
    });

    // Add the "See All Messages" link at the bottom
    dropdown.innerHTML += `<li><div style="width: 100%">See All Messages</div></li>`;
  });