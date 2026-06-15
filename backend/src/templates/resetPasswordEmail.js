const resetPasswordEmail = (username, resetUrl) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Réinitialisation du mot de passe — Dishly</title>
</head>
<body style="margin:0;padding:0;background-color:#faf7f2;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#faf7f2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td align="center" style="padding-bottom:32px;">
              <h1 style="margin:0;font-size:36px;font-weight:800;color:#c8510a;letter-spacing:-1px;">Dishly</h1>
              <p style="margin:6px 0 0;font-size:14px;color:#a89080;">Partagez vos recettes avec le monde</p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff;border-radius:20px;border:1px solid #e4d8c8;padding:40px;box-shadow:0 4px 24px rgba(26,18,8,0.08);">

              <div style="text-align:center;margin-bottom:24px;">
                <span style="font-size:48px;">🔐</span>
              </div>

              <h2 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#1c1108;text-align:center;">
                Réinitialisation du mot de passe
              </h2>
              <p style="margin:0 0 28px;font-size:15px;color:#6b5d4f;line-height:1.6;text-align:center;">
                Bonjour <strong>${username}</strong>, vous avez demandé à réinitialiser votre mot de passe.<br/>
                Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
              </p>

              <div style="text-align:center;margin-bottom:28px;">
                <a href="${resetUrl}"
                   style="display:inline-block;background-color:#c8510a;color:#ffffff;text-decoration:none;
                          font-size:16px;font-weight:700;padding:16px 40px;border-radius:14px;">
                  Réinitialiser mon mot de passe →
                </a>
              </div>

              <hr style="border:none;border-top:1px solid #f2ece0;margin:0 0 20px;" />

              <p style="margin:0;font-size:12px;color:#a89080;text-align:center;line-height:1.6;">
                Ce lien est valable <strong>1 heure</strong>.<br/>
                Si vous n'avez pas demandé cette réinitialisation, ignorez cet email — votre mot de passe restera inchangé.<br/>
                <a href="${resetUrl}" style="color:#c8510a;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-size:12px;color:#a89080;">
                © ${new Date().getFullYear()} Dishly — Fait avec ♡ pour les passionnés de cuisine.
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

module.exports = resetPasswordEmail;
