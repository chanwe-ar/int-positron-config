# positron_config

## Chanwe dependencies

### Chanwe brand extension

**Current use:** This repository does not currently render Chanwe Quarto output. Install the extension bundle when adding branded documents or reports:

```bash
quarto add ../chanwe-brand
```

Update a clean installation:

```bash
git -C ../chanwe-brand pull --ff-only
quarto add ../chanwe-brand
```

`quarto add` replaces files under `_extensions/chanwe-*`; preserve project-specific extension changes before updating.

### `chanwer` R package

**Current use:** This repository does not currently use `chanwer`. Install it when adding Chanwe-styled R charts or tables:

```r
if (!requireNamespace("pak", quietly = TRUE)) install.packages("pak")
pak::pak("chanwe-ar/chanwer")
```

Re-run `pak::pak("chanwe-ar/chanwer")` to update the package.
