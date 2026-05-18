const express  = require('express');
const router   = express.Router();
const supabase = require('../config/supabase');

// Basic input validation helpers
const isValidEmail = (v) => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPassword = (v) => typeof v === 'string' && v.length >= 8;
const isValidName = (v) => typeof v === 'string' && v.trim().length >= 1 && v.trim().length <= 80;

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!isValidEmail(email))    return res.status(400).json({ success: false, error: 'Please enter a valid email address' });
    if (!isValidPassword(password)) return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    if (!isValidName(name))      return res.status(400).json({ success: false, error: 'Name is required' });

    const { data, error } = await supabase.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { name: name.trim() },
    });

    if (error) {
      const msg = error.message.includes('already') ? 'Email already registered' : 'Signup failed';
      return res.status(400).json({ success: false, error: msg });
    }

    // Create placeholder profile row (non-blocking)
    supabase.from('user_profiles').insert([{
      user_id: data.user.id,
      name: name.trim(),
      difficulty_level: 'beginner',
    }]).then(({ error: e }) => {
      if (e) console.error('Profile pre-create error (non-blocking):', e.message);
    });

    res.json({ success: true, user: { id: data.user.id, email: data.user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, error: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      // Always return generic message — never reveal whether email exists
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    res.json({ success: true, user: data.user, session: data.session, profile: profile || null });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (token) {
      // Resolve the user ID so we can revoke all their sessions server-side
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        await supabase.auth.admin.signOut(user.id, 'global');
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, error: 'Server error during logout' });
  }
});

// GET /api/auth/user
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '').trim();
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    res.json({ success: true, user, profile: profile || null });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
