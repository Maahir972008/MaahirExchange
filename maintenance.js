(function () {
  function getMaintenanceStatus() {
    return localStorage.getItem('maintenance') === 'on';
  }

  function setMaintenanceStatus(enabled) {
    if (enabled) {
      localStorage.setItem('maintenance', 'on');
    } else {
      localStorage.removeItem('maintenance');
    }
  }

  window.getMaintenanceStatus = getMaintenanceStatus;
  window.toggleMaintenance = function (enable) {
    setMaintenanceStatus(enable);
    if (window.location.pathname.includes('admin.html')) {
      window.location.reload();
    }
  };

  const maintenanceEnabled = getMaintenanceStatus();
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const isAdminPage = path === 'admin.html';
  const isMaintenancePage = path === 'maintenance.html';

  if (maintenanceEnabled && !isAdminPage && !isMaintenancePage) {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get('return') || window.location.pathname + window.location.search;
    const nextUrl = 'maintenance.html' + (returnTo ? '?return=' + encodeURIComponent(returnTo) : '');
    window.location.replace(nextUrl);
    return;
  }

  if (!document.body) return;

  document.body.classList.add('site-ready');

  if (!document.querySelector('.floating-admin-btn')) {
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.className = 'floating-admin-btn';
    adminLink.setAttribute('aria-label', 'Open admin panel');
    adminLink.title = 'Admin / maintenance panel';
    adminLink.innerHTML = '<i class="fas fa-toolbox"></i>';
    document.body.appendChild(adminLink);
  }

  if (!document.querySelector('.maintenance-banner') && maintenanceEnabled && isMaintenancePage) {
    const banner = document.createElement('div');
    banner.className = 'maintenance-banner';
    banner.innerHTML = '<span><i class="fas fa-tools"></i> Maintenance mode is active</span><a href="admin.html">Manage the site from the admin panel</a>';
    document.body.prepend(banner);
  }
})();
