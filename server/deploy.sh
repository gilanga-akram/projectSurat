# rm -rf dist node_modules
# # npm install
# # npm run build
tar czf surat-api.tar.gz src
scp surat-api.tar.gz ubuntu@167.99.71.109:./app
rm surat-api.tar.gz

ssh ubuntu@167.99.71.109 <<'ENDSSH'
  cd app
  tar xf surat-api.tar.gz
  rm surat-api.tar.gz
  exit
ENDSSH