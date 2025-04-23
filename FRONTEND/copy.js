document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".copy-btn").forEach(button => {
      button.addEventListener("click", () => {
        const boardText = button.parentElement.querySelector("pre").textContent;
        navigator.clipboard.writeText(boardText).then(() => {
          button.innerHTML = `<i class="fa fa-check"></i>`;
          setTimeout(() => {
            button.innerHTML = `<i class="fa fa-copy"></i>`;
          }, 1500);
        });
      });
    });
  });