'use strict'

const {
  filterVulns,
  SEVERITY_RMAP
} = require('./util')

module.exports = renderHTML

function renderHTML (title, summary, report, reportLength, whitelist, whitelistLength, formattedFilterOptions) {
  const { riskCount, securityCount, insecureModules, complianceCount } = summary

  let alternate = false
  let whitelistInfo = ''
  for (const pkg of whitelist) {
    whitelistInfo += segment(pkg)
  }

  alternate = false
  let pkgInfo = ''
  for (const pkg of report) {
    pkgInfo += segment(pkg)
  }

  function segment (pkg) {
    const { name, version, maxSeverity, failures, license } = pkg
    const pkgVulns = filterVulns(failures).map((v, i) => v !== 0
      ? `<p class="${['light1', 'yellow', 'orange', 'red'][i]}">
          ${v}&nbsp;${['Low', 'Medium', 'High', 'Critical'][i]}
        </p>`
      : ''
    )
    const pkgLicense = license && license.data && license.data.spdx ? license.data.spdx : 'UNKNOWN'
    const pkgLicensePass = license && license.pass === true
    const pkgSeverity = `
    <p>
      <span class="${['light1', 'white', 'yellow', 'orange', 'red'][maxSeverity]}">
        ${['', '|&nbsp;', '|&nbsp;|&nbsp;', '|&nbsp;|&nbsp;|&nbsp;', '|&nbsp;|&nbsp;|&nbsp;|'][maxSeverity]}</span
      >${['|&nbsp;|&nbsp;|&nbsp;|', '|&nbsp;|&nbsp;|', '|&nbsp;|', '|', ''][maxSeverity]}&nbsp;&nbsp;${SEVERITY_RMAP[maxSeverity]}
    </p>`

    alternate = !alternate
    return `
    <tr class="module-element" ${alternate ? 'style="background:#2e3535"' : ''}>
      <td>
        <p><span class="white">${name}</span>@${version}</p>
      </td>
      <td>
        <p>${pkgSeverity}</p>
      <td>
        <p>
          <span class="${pkgLicensePass ? 'green">✓' : 'red">X'}</span>&nbsp;${pkgLicense}
        </p>
      </td>
      <td>
        <p>
    ${pkgVulns.join('').length === 0
    ? '<span class="green">✓</span>&nbsp;0'
    : pkgVulns.reverse().join(' ')}
        </p>
      </td>
    </tr>
    `
  }

  const template = `
  <!DOCTYPE html>
  <html lang="en">
    <meta charset="utf-8">
    <head>
      <title>NCM Report > ${title}</title>
      <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,400&display=swap" rel="stylesheet">
      <style>
        body {
          padding: 2%;
          color: #89a19d;
          font-family: 'Source Sans Pro', Helvetica;
          font-weight: 400;
        }
        a {
          color: #5ac878;
          text-decoration: none;
        }
        p {
          margin: 0;
        }
        td {
          padding-top: 3px;
          padding-bottom: 3px;
          padding-left: 10px;
          padding-right: 10px;
        }
        th {
          text-align: left;
        }
        table {
          width: 100%;
        }
        .title {
          font-size: 28pt;
          color:#e1e7e6;
        }
        .subtitle {
          font-size: 20pt;
          color: #e1e7e6;
        }
        .module-element {
          margin: 4px;
        }
        .bottom-20 {
          margin-bottom: 20px;
        }
        .left-20 {
          margin-left: 20px;
        }
        .white {
          color: #e1e7e6;
        }
        .light1 {
          color: #89a19d;
        }
        .yellow {
          color: #ffb726;
        }
        .orange {
          color: #ff8b40;
        }
        .red {
          color: #ff6040;
        }
        .green {
          color: #5ac878;
        }
      </style>
    </head>
    <body style="background: #202525">

      <div id="ns-branding" class="bottom-20">
        <svg xmlns="http://www.w3.org/2000/svg" height="50" width="auto" viewBox="0 0 100 100">
          <path d="M89.243 20.864L55.642 1.5a11.21 11.21 0 0 0-11.2 0L10.778 20.937a11.208 11.208 0 0 0-5.6 9.7l-.032 38.781a11.2 11.2 0 0 0 5.611 9.718L44.359 98.5a11.208 11.208 0 0 0 11.2 0l33.663-19.437a11.206 11.206 0 0 0 5.6-9.7l.028-38.784a11.2 11.2 0 0 0-5.607-9.715zM46.36 4.823a7.338 7.338 0 0 1 1.723-.718v16.552a1.917 1.917 0 0 0 3.834 0V4.079a7.369 7.369 0 0 1 1.81.741l33.6 19.366a7.322 7.322 0 0 1 1.522 1.169L68.486 37.113a22.518 22.518 0 0 0-36.983.014L11.186 25.418a7.329 7.329 0 0 1 1.51-1.16zM68.713 50a18.74 18.74 0 0 1-16.8 18.616V51.107l15.149-8.746A18.579 18.579 0 0 1 68.713 50zm-35.785-7.626l15.155 8.734v17.508a18.679 18.679 0 0 1-15.155-26.242zM50 47.786l-15.149-8.729a18.651 18.651 0 0 1 30.288-.012zM12.672 75.813a7.284 7.284 0 0 1-1.522-1.168l13.117-7.574a1.918 1.918 0 0 0-1.918-3.321L9.232 71.323a7.316 7.316 0 0 1-.251-1.9l.029-38.786a7.274 7.274 0 0 1 .254-1.9l20.318 11.71a22.53 22.53 0 0 0 18.5 32.015v22.945a1.9 1.9 0 0 0 .083.53 7.351 7.351 0 0 1-1.892-.757zm40.969 19.364a7.362 7.362 0 0 1-1.8.741 1.919 1.919 0 0 0 .077-.511V72.461A22.533 22.533 0 0 0 70.411 40.43l20.357-11.754a7.329 7.329 0 0 1 .251 1.9l-.028 38.784a7.33 7.33 0 0 1-.264 1.937L77.651 63.75a1.918 1.918 0 0 0-1.918 3.321l13.053 7.536a7.3 7.3 0 0 1-1.481 1.135z" fill="#89a19d"></path>
        </svg>
        <svg height="30" width="auto" viewBox="0 0 346.17 33.7" style="display:inline-block;fill:#fff;">
          <path d="M24.54,33.07a1.88,1.88,0,0,1-1.47-.71L3.75,7.9V31.2A1.88,1.88,0,1,1,0,31.2V2.5A1.88,1.88,0,0,1,3.35,1.34L22.67,25.8V2.5a1.88,1.88,0,0,1,3.75,0V31.2a1.88,1.88,0,0,1-1.87,1.88Z"></path><path d="M48.92,33.7c-8.81,0-16-7.56-16-16.85S40.11,0,48.92,0s16,7.56,16,16.85S57.72,33.7,48.92,33.7Zm0-29.95c-6.74,0-12.22,5.88-12.22,13.1s5.48,13.1,12.22,13.1,12.22-5.88,12.22-13.1S55.66,3.75,48.92,3.75Z"></path><path d="M177.24,33.7c-8.81,0-16-7.56-16-16.85S168.43,0,177.24,0s16,7.56,16,16.85S186,33.7,177.24,33.7Zm0-29.95C170.5,3.75,165,9.63,165,16.85s5.48,13.1,12.22,13.1,12.22-5.88,12.22-13.1S184,3.75,177.24,3.75Z"></path><path d="M234.8,33.07a1.88,1.88,0,0,1-1.87-1.88V2.5A1.88,1.88,0,0,1,234.8.62h13.31c5.67,0,9.78,3.79,9.78,9s-4.11,9-9.78,9H236.67V31.2A1.88,1.88,0,0,1,234.8,33.07Zm1.88-18.18h11.43c3.55,0,6-2.16,6-5.26s-2.48-5.26-6-5.26H236.67Z"></path><path d="M212.47,33.7A13.51,13.51,0,0,1,199.16,20V2.5a1.88,1.88,0,0,1,3.75,0V20A9.57,9.57,0,1,0,222,20V2.5a1.88,1.88,0,0,1,3.75,0V20A13.51,13.51,0,0,1,212.47,33.7Z"></path><path d="M152.72,6.59l-.18-.12c-.12-.08-.31-.21-.51-.33a18.63,18.63,0,0,0-1.91-1A14.31,14.31,0,0,0,147,4a13,13,0,0,0-4.25-.17,8.14,8.14,0,0,0-4.29,1.67A4.4,4.4,0,0,0,136.9,9.7a3.81,3.81,0,0,0,.3,1,3.68,3.68,0,0,0,.61,1A6.93,6.93,0,0,0,140,13.22a17.68,17.68,0,0,0,3,1c.54.14,1.09.26,1.64.37s1.15.23,1.82.41a22.48,22.48,0,0,1,3.7,1.25,13.74,13.74,0,0,1,3.49,2.14,8.41,8.41,0,0,1,2.52,3.66c.11.36.2.74.28,1.11s.09.75.1,1.12v.89l0,.17,0,.1-.06.42,0,.21-.07.29a8.86,8.86,0,0,1-5.21,6,15.75,15.75,0,0,1-6.39,1.31,12.44,12.44,0,0,1-1.47-.07,14.11,14.11,0,0,1-1.46-.22,17.07,17.07,0,0,1-2.49-.72,20.61,20.61,0,0,1-3.68-1.84,21.46,21.46,0,0,1-2.13-1.54c-.47-.39-.72-.62-.72-.62l0,0a1.69,1.69,0,0,1,2.26-2.5s.2.17.61.47a19.79,19.79,0,0,0,1.86,1.2,17.77,17.77,0,0,0,3.1,1.43,13.37,13.37,0,0,0,2,.54c.35.06.71.12,1,.14a10.25,10.25,0,0,0,1.15,0,12.07,12.07,0,0,0,4.86-1,6.41,6.41,0,0,0,2-1.38,3.17,3.17,0,0,0,.38-.45,2.58,2.58,0,0,0,.31-.48,4.25,4.25,0,0,0-1.06-5.41,14,14,0,0,0-5.61-2.57c-.48-.14-1.17-.26-1.67-.38s-1.23-.26-1.84-.42a21.32,21.32,0,0,1-3.68-1.27A10.58,10.58,0,0,1,135,14.17,7.53,7.53,0,0,1,133.17,10a3.77,3.77,0,0,1,0-.48l0-.42v-.6l0-.53c0-.35.11-.7.18-1s.19-.68.32-1A8.25,8.25,0,0,1,136,2.67a11.8,11.8,0,0,1,6.3-2.54,15.79,15.79,0,0,1,5.47.29,16.09,16.09,0,0,1,3.94,1.48A17.75,17.75,0,0,1,154,3.31l.71.53a1.69,1.69,0,0,1-2,2.75Z"></path><path d="M79.8,33.07H73.15a1.88,1.88,0,0,1-1.87-1.88V2.5A1.88,1.88,0,0,1,73.15.62H79.8c12.62,0,18.27,8.15,18.27,16.22C98.07,27.16,91.41,33.07,79.8,33.07ZM75,29.32H79.8c12,0,14.52-6.78,14.52-12.47,0-7.58-5.7-12.47-14.52-12.47H75Z"></path><path d="M125.54,33.07H106.37a1.88,1.88,0,0,1-1.87-1.88V2.5A1.88,1.88,0,0,1,106.37.62h19.17a1.87,1.87,0,1,1,0,3.75H108.24V29.32h17.29a1.88,1.88,0,0,1,0,3.75Z"></path><path d="M120.39,18.66h-14a1.88,1.88,0,0,1,0-3.75h14a1.87,1.87,0,0,1,0,3.75Z"></path><path d="M319.58,33.07H300.41a1.88,1.88,0,0,1-1.87-1.88V2.5A1.88,1.88,0,0,1,300.41.62h19.17a1.87,1.87,0,1,1,0,3.75H302.29V29.32h17.29a1.88,1.88,0,0,1,0,3.75Z"></path><path d="M314.44,18.66H300.8a1.88,1.88,0,0,1,0-3.75h13.63a1.88,1.88,0,0,1,0,3.75Z"></path><path d="M256.16,33.07a1.87,1.87,0,0,1-1.53-.79L244.5,17.93a1.88,1.88,0,0,1,3.06-2.16l10.13,14.35a1.88,1.88,0,0,1-1.53,3Z"></path><path d="M291.05,28.93l-.58.55a17.13,17.13,0,0,1-2,1.54,16.17,16.17,0,0,1-8.36,2.66h-.78l-.63,0a10.23,10.23,0,0,1-1.39-.13,16.51,16.51,0,0,1-3.05-.7,16.71,16.71,0,0,1-5.73-3.27,16.91,16.91,0,0,1-5.82-12.72l0-.91c0-.28,0-.53.05-.84.1-.63.17-1.3.31-1.9a16.8,16.8,0,0,1,1.18-3.45,17,17,0,0,1,4.24-5.62A16.71,16.71,0,0,1,274.28.86,17.45,17.45,0,0,1,280.12,0a16.27,16.27,0,0,1,8.38,2.66,17.06,17.06,0,0,1,2,1.52l.63.6a1.69,1.69,0,0,1-2.24,2.51l-.09-.07-.53-.45a14,14,0,0,0-1.61-1.11A13.58,13.58,0,0,0,280,3.76a14,14,0,0,0-4.57.66A13,13,0,0,0,271,7a13.24,13.24,0,0,0-3.3,4.37A13,13,0,0,0,266.8,14c-.11.46-.14.88-.23,1.32,0,.23,0,.53-.05.8l0,.72A13.16,13.16,0,0,0,271,26.74a12.9,12.9,0,0,0,6.71,3.06,7.27,7.27,0,0,0,1.19.11l.63,0H280A13.5,13.5,0,0,0,286.61,28a14.42,14.42,0,0,0,1.59-1.09l.59-.5h0a1.69,1.69,0,0,1,2.26,2.51Z"></path><path d="M337.88.2a8.29,8.29,0,1,0,8.29,8.29A8.3,8.3,0,0,0,337.88.2Zm0,15.12a6.83,6.83,0,1,1,6.83-6.83A6.84,6.84,0,0,1,337.88,15.32Z"></path><path d="M335.87,12.12a.61.61,0,0,1-.61-.61v-6a.61.61,0,0,1,.61-.61h2.81a2.12,2.12,0,1,1,0,4.23h-2.2v2.43A.61.61,0,0,1,335.87,12.12Zm.61-4.26h2.2a.91.91,0,1,0,0-1.79h-2.2Z"></path><path d="M340.38,12.12a.61.61,0,0,1-.5-.26l-2.13-3a.61.61,0,0,1,1-.7l2.13,3a.61.61,0,0,1-.5,1Z"></path>
        </svg>
      </div>

      <div id="title" class="bottom-20">
        <div class="title">
          <p>
            NCM&nbsp;Project&nbsp;Report
            <span class="light1">&nbsp;>&nbsp;</span>
            ${title}
          </p>
        </div>
        <div class="left-20">
          <p>
            <b class="green">></b>
            Powered by
            <a href="https://docs.nodesource.com/ncmv2/docs">NodeSource Certified Modules v2</a>
          </p>
        </div>
      </div>

      <div id="summary" class="bottom-20 left-20">
        <span class="subtitle">Summary</span>
        <p><b class="white">${reportLength}</b> packages checked</p>
        <br>
        <p><span class="red"><b>${riskCount[4]}</b> Critical Risk</span></p>
        <p><span class="orange"><b>${riskCount[3]}</b> High Risk</span></p>
        <p><span class="yellow"><b>${riskCount[2]}</b> Medium Risk</span></p>
        <p><span class-"light1"><b>${riskCount[1]}</b> Low Risk</span></p>
        <br>
        <p>         
    ${(securityCount > 0
    ? `<b class="red">!&nbsp;</b>
      <b class="white">${securityCount}</b> 
      security vulnerabilities found across 
      <b class="white">${insecureModules}</b> modules`
    : '<span class="green">✓</span> No security vulnerabilities found')}
        </p>
        <p>
    ${(complianceCount > 0
    ? `<b class="red">!&nbsp;</b>
      <b class="white">${complianceCount}</b> noncompliant modules found`
    : '<span class="green">✓</span> All modules compliant')}
        </p>
    ${(whitelistLength > 0
    ? `<p>
        <b class="orange">!&nbsp;</b>
        <b class="white">${whitelistLength}</b> used modules whitelisted
      </p>`
    : '')}
      </div>

      ${(whitelistLength > 0
    ? `
          <div id="whitelist-list">
            <p>
              <span class="subtitle">
                Whitelisted
    ${(formattedFilterOptions.length > 9
      ? 'Filtered'
      : '')}
                Modules
              </span>
    ${(formattedFilterOptions.length > 9
      ? `(${formattedFilterOptions})`
      : '')}

            </p>
            <hr>
            <table id="whitelist-table" class="bottom-20">
              <tr style="margin-bottom:5px;">
                <th>Module Name</th>
                <th>Risk</th>
                <th>License</th>
                <th>Security</th>
              </tr>
              ${whitelistInfo}
            </table>
          </div>
          `
    : '')}
      
      <div id="module-list">
        <p>
          <span class="subtitle">
    ${(whitelistLength > 0
    ? 'Non-Whitelisted'
    : '')}
    ${(formattedFilterOptions.length > 9
    ? 'Filtered'
    : '')}
            Modules
          </span>
    ${(formattedFilterOptions.length > 9
    ? `( ${formattedFilterOptions} )`
    : '')}
        </p>
        <hr>
        <table id="module-table" class="bottom-20">
          <tr style="margin-bottom:5px;">
            <th>Module Name</th>
            <th>Risk</th>
            <th>License</th>
            <th>Security</th>
          </tr>
          ${pkgInfo}
        </table>
      </div>
    </body>
  </html>
  `

  return template
}
