window.addEventListener("load", () => {
  const authBtn = document.getElementById('authBtn');
  const modal = document.getElementById('authModal');
  const emailField = document.getElementById('email');
  const passwordField = document.getElementById('password');
  const submitBtn = document.getElementById('submitAuth');
  const toggleBtn = document.getElementById('toggleAuth');
  const errorMessage = document.getElementById('authError');

  let isRegistering = false;

  // Show modal on click
  authBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    toggleBtn.textContent = 'Switch to Register';
    submitBtn.textContent = 'Sign In';
    isRegistering = false;
  });

  // Toggle between login and register
  toggleBtn.addEventListener('click', () => {
    isRegistering = !isRegistering;
    submitBtn.textContent = isRegistering ? 'Register' : 'Sign In';
    toggleBtn.textContent = isRegistering ? 'Switch to Sign In' : 'Switch to Register';
    errorMessage.textContent = '';
  });

  // Submit login/register
  submitBtn.addEventListener('click', async () => {
    const email = emailField.value;
    const password = passwordField.value;
    errorMessage.textContent = '';

    try {
      let userCred;
      if (isRegistering) {
        userCred = await auth.createUserWithEmailAndPassword(email, password);
      } else {
        userCred = await auth.signInWithEmailAndPassword(email, password);
      }

      const user = userCred.user;
      modal.style.display = 'none';
      authBtn.textContent = `Hi, ${user.email}`;

      // Optional: save user to Firestore
      if (isRegistering) {
        await db.collection('users').doc(user.uid).set({
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }

    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });

  // Maintain login state
  auth.onAuthStateChanged(user => {
    if (user) {
      authBtn.textContent = `Welcome, ${user.email}`;
    } else {
      authBtn.textContent = 'Sign In / Register';
    }
  });
});
