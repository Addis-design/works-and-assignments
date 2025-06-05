const db = require('../config/database');
const bcrypt = require('bcryptjs');
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}
async function seed() {
  try {
     // Insert sample links
    const link1 = await runQuery(
      'INSERT INTO links (title, description, user_id) VALUES (?, ?, ?)',
      ['Raccoon Habitats', 'Discover natural habitats', 1]
    );
    const link2 = await runQuery(
      'INSERT INTO links (title, description, user_id) VALUES (?, ?, ?)',
      ['Raccoon Facts', 'Fun facts about raccoons', 2]
    );
    console.log('Sample links inserted');

    // Insert sample ratings
    await runQuery(
      'INSERT INTO ratings (user_id, link_id, value) VALUES (?, ?, ?)',
      [1, 1, 1] // User 1 rated link 1 positively
    );
    await runQuery(
      'INSERT INTO ratings (user_id, link_id, value) VALUES (?, ?, ?)',
      [2, 1, -1] // User 2 rated link 1 negatively
    );
    await runQuery(
      'INSERT INTO ratings (user_id, link_id, value) VALUES (?, ?, ?)',
      [1, 2, 1] // User 1 rated link 2 positively
    );
    console.log('Sample ratings inserted');

    // Insert sample hidden links
    await runQuery(
      'INSERT INTO hidden_links (user_id, link_id) VALUES (?, ?)',
      [2, 1] // User 2 hid link 1
    );
    console.log('Sample hidden links inserted');

  } catch (error) {
    console.error('Error during seeding:', error);
  }
};


seed().then(() => console.log('Sample data inserted'));