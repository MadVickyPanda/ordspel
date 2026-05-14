import app from './expressApp';

const PORT = 5080;

// ======================
// START SERVER
// ======================
// Viktigt: exporteras indirekt via app så tests kan importera den utan att starta servern
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

export default app;