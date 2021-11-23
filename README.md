# Democracy-Clothing-Updated
Democracy Clothing Updated Theme
## Getting started

1. Democracy Clothing the repository and clone it:
```sh
git clone git@github.com:faisalriaz-visionet/Democracy-Clothing-Updated.git
cd Democracy-Clothing-Updated
```
2. Download theme:
```sh
theme get --password=1234444 --store="qa-democracyclothing-com.myshopify.com" --themeid=1222
```
3. Upload new theme:
```sh
theme new --password=12222 --store="qa-democracyclothing-com.myshopify.com" --name="Add Theme Name"
```
4. Add config.yml:
```sh
staging:
  password: 12333
  theme_id: "1222"
  store: store.myshopify.com
```

5. Watch theme:
```sh
theme watch --env=staging
```

6. Deploy theme:
```sh
theme deploy --allow-live --env=staging
```
