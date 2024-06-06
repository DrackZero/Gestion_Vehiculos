export function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  sidebar.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('.toggle-btn');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleSidebar);
  }
});
