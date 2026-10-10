# GitHub Pages Auto-Index

A responsive repository portal that automatically discovers HTML and Markdown pages inside a **public GitHub repository**, groups them by folder, and provides search and Markdown preview.

## Features

- Automatically reads the repository file tree through the GitHub REST API.
- Discovers `.html`, `.htm`, `.md`, and `.markdown` files recursively.
- Groups pages by repository folder.
- Search, folder filters, and sorting.
- Opens HTML pages normally and renders Markdown in a preview dialog.
- No build step, framework, backend, or GitHub token required for public repositories.

## 1. Configure the repository

Edit `config.js`:

```js
window.SITE_CONFIG = {
  owner: "YOUR_GITHUB_USERNAME",
  repo: "YOUR_REPOSITORY_NAME",
  branch: "main",
  title: "Repository Hub",
  description: "A searchable home for your guides, labs, and project documentation.",
  ignoredFolders: [".git", ".github", "node_modules", "assets", "vendor"]
};
```

Example: for `https://octocat.github.io/cloud-labs/`, use `owner: "octocat"` and `repo: "cloud-labs"`. Set `branch` to the branch that GitHub Pages publishes from.

## 2. Add the files to your repository

Copy `index.html`, `config.js`, and the `assets/` directory into the root of the repository. Keep your existing folders and pages.

Example structure:

```text
your-repository/
├── index.html
├── config.js
├── assets/
│   ├── app.js
│   └── style.css
├── aws/
│   ├── eventbridge-lab.html
│   └── step-functions.md
├── azure/
│   └── architecture.html
└── architecture/
    └── README.md
```

New HTML and Markdown files are discovered automatically; you do not need to edit a navigation menu. The `index.html` and `home.html` files are excluded from the generated list to avoid listing the portal itself.

## 3. Enable GitHub Pages

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the publishing branch (for example, `main`) and `/ (root)` or the folder where you placed these files.
5. Save and wait for deployment.

Your site should be available at `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`. For a user/organization site repository named `YOUR_GITHUB_USERNAME.github.io`, the URL is `https://YOUR_GITHUB_USERNAME.github.io/`.

## Important behavior and limitations

- The GitHub repository must be public for the no-token setup to work reliably. Do not put a personal access token in browser-side JavaScript.
- The GitHub API has unauthenticated rate limits. A very large repository may return a truncated tree.
- HTML pages open directly so their own CSS, JavaScript, images, and relative links work. Keep their assets in the repository.
- Markdown preview uses the public `marked` and DOMPurify CDN scripts. If a Markdown file references relative images or links, those references may work best when opened from the published page.
- Files are listed when they are committed to the configured repository/branch. A file must also be published by GitHub Pages to open successfully.
- To hide a folder from discovery, add its folder name to `ignoredFolders` in `config.js`.
- This portal does not crawl external links or dynamically list files from a private repository.

## Troubleshooting

- **Setup required**: check `owner`, `repo`, and `branch` in `config.js`.
- **Repository or branch not found**: confirm spelling and that the repository is public.
- **A page appears but does not open**: confirm GitHub Pages publishes that path and check relative links/assets.
- **New files do not appear**: refresh the page; check that the files use one of the supported extensions and are not under an ignored folder.
