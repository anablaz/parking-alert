      // Function to populate the table
      function populateTable() {
        const tableBody = document.querySelector("#site table tbody");

        // Assuming you have a `usersData` array already defined with your data
        usersData.forEach((user) => {
          // Create a new row
          const row = document.createElement("tr");

          // Create first cell for Armada/Time
          const cell1 = document.createElement("td");
          cell1.classList.add("armada-devider");

          const armadaDiv = document.createElement("div");
          armadaDiv.classList.add("armada");

          const userSpan = document.createElement("span");
          userSpan.style.background = "#65c3df";
          userSpan.innerHTML = `<span class="fa fa-user"></span>&nbsp;&nbsp;User`;

          const timeParagraph = document.createElement("p");
          timeParagraph.innerHTML = `<span class="entypo-gauge"></span>&nbsp;${user.timeAgo} <i>ago</i>`;

          armadaDiv.appendChild(userSpan);
          armadaDiv.appendChild(timeParagraph);
          cell1.appendChild(armadaDiv);
          row.appendChild(cell1);

          // Create second cell for User Info
          const cell2 = document.createElement("td");
          cell2.classList.add("driver-devider");

          const img = document.createElement("img");
          img.classList.add("armada-pic", "img-circle");
          img.src = user.userImage;
          img.alt = "";

          const userName = document.createElement("h3");
          userName.textContent = user.name;

          cell2.appendChild(img);
          cell2.appendChild(userName);
          row.appendChild(cell2);

          // Create third cell for Description
          const cell3 = document.createElement("td");
          const description = document.createElement("p");
          description.textContent = user.description;
          cell3.appendChild(description);
          row.appendChild(cell3);

          // Append the row to the table body
          tableBody.appendChild(row);
        });
      }

      // Call the function to populate the table when the document is ready
      document.addEventListener("DOMContentLoaded", populateTable);