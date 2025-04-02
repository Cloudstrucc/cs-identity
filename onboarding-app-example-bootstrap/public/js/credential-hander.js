document.addEventListener('DOMContentLoaded', function() {
  const issueVcBtn = document.getElementById('issue-vc-btn');
  
  if (issueVcBtn) {
    issueVcBtn.addEventListener('click', async function() {
      try {
        // Get user information from the form or session
        const userData = {
          name: document.getElementById('name')?.value || 'User',
          email: document.getElementById('email')?.value || 'user@example.com',
          // Add other relevant user data
        };
        
        // Call your backend API to request a DID credential
        const response = await fetch('/api/request-credential', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
          throw new Error('Failed to request credential');
        }
        
        const data = await response.json();
        
        // Display QR code
        if (data.qrCodeUrl) {
          // Create QR code display container
          const qrContainer = document.createElement('div');
          qrContainer.className = 'mt-4 text-center';
          qrContainer.innerHTML = `
            <h4>Scan this QR code to receive your DID credential</h4>
            <img src="${data.qrCodeUrl}" alt="QR Code" class="img-fluid" style="max-width: 300px;">
            <p class="mt-2">This QR code will expire in 10 minutes</p>
          `;
          
          // Add container after the button
          issueVcBtn.parentNode.appendChild(qrContainer);
          
          // Hide the button after successful QR generation
          issueVcBtn.style.display = 'none';
        }
      } catch (error) {
        console.error('Error requesting credential:', error);
        alert('Failed to generate credential QR code. Please try again.');
      }
    });
  }
});
