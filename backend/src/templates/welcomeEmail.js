const welcomeEmail = (username) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenue sur Dishly</title>
</head>
<body style="margin:0;padding:0;background-color:#faf7f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:36px;font-weight:800;color:#c8510a;letter-spacing:-1px;">
                Dishly
              </h1>
              <p style="margin:6px 0 0;font-size:14px;color:#a89080;">Partagez vos recettes avec le monde</p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border-radius:20px;border:1px solid #e4d8c8;padding:40px;box-shadow:0 4px 24px rgba(26,18,8,0.08);">

              <h2 style="margin:0 0 8px;font-size:28px;font-weight:700;color:#1c1108;">
                Bienvenue, ${username} ! 🎉
              </h2>
              <p style="margin:0 0 24px;font-size:15px;color:#6b5d4f;line-height:1.6;">
                Votre compte Dishly a bien été créé. Vous faites maintenant partie d'une communauté de passionnés de cuisine.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f2ece0;margin:0 0 24px;" />

              <!-- Features -->
              <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#1c1108;text-transform:uppercase;letter-spacing:0.5px;">
                Ce que vous pouvez faire
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ['🍳', 'Créer et partager vos recettes', 'Ajoutez des photos, ingrédients et étapes de préparation.'],
                  ['❤️', 'Sauvegarder vos favoris', 'Retrouvez toutes vos recettes préférées en un clic.'],
                  ['🔍', 'Explorer la communauté', 'Filtrez par difficulté, catégorie ou temps de préparation.'],
                ].map(([icon, title, desc]) => `
                <tr>
                  <td style="padding:10px 0;vertical-align:top;width:40px;">
                    <span style="font-size:22px;">${icon}</span>
                  </td>
                  <td style="padding:10px 0 10px 12px;">
                    <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#1c1108;">${title}</p>
                    <p style="margin:0;font-size:13px;color:#a89080;">${desc}</p>
                  </td>
                </tr>`).join('')}
              </table>

              <!-- CTA -->
              <div style="text-align:center;margin-top:32px;">
                <a href="${process.env.CLIENT_URL}"
                   style="display:inline-block;background-color:#c8510a;color:#ffffff;text-decoration:none;
                          font-size:15px;font-weight:700;padding:14px 36px;border-radius:14px;">
                  Découvrir les recettes →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#a89080;">
                Vous recevez cet email car vous venez de créer un compte sur
                <a href="${process.env.CLIENT_URL}" style="color:#c8510a;text-decoration:none;">Dishly</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = welcomeEmail;
