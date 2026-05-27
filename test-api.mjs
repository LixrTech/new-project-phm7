const response = await fetch('https://ta-01ksmeaq8nfz6g5kchrmjv48af-9001-ujbtmg6mmykiuj7z8f0y1stcl.w.modal.host/store/storefront-settings');
const data = await response.json();
console.log(JSON.stringify(data, null, 2));
