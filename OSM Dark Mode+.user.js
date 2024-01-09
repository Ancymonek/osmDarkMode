// ==UserScript==
// @name         OSM Dark Mode+
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Dark mode for OpenStreetMap website
// @author       Ancymon
// @match        https://www.openstreetmap.org/*
// @icon         https://www.google.com/s2/favicons?domain=openstreetmap.org
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @resource   IMPORTED_CSS https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/bootstrap-dark.min.css
// @run-at document-end
// ==/UserScript==

(
    function () {
        'use strict';

        const bootstrapDark = GM_getResourceText("IMPORTED_CSS");
        GM_addStyle(bootstrapDark);

        const darkColor = '#343a40';
        const darkColorSecondary = '#3a4046';
        const primaryFontColor = '#FFFFFF';
        const activeElemColor = '#4c545d';
        const linkColor = '#e1e1e1';
        const osmGreenColor = '#76c551';
        let css = `
                    h2, h3 {
                      font-size: 1.55rem !important;
                    }
                    .details,
                    .secondary-actions {
                        font-size: small !important;
                    }

                    .browse-section p,
                    .note-description {
                        border-left: 5px solid ${osmGreenColor} !important;
                        padding: 10px !important;
                        background-color: ${darkColorSecondary} !important;
                        border-radius: 0.25rem !important;
                        font-size: normal !important;
                    }

                    .btn-outline-primary {
                        border-color: ${osmGreenColor} !important;
                    }

                    .col-auto
                    {
                       color: ${osmGreenColor} !important;
                    }

                    .loader {
                        font-size: small !important;
                        filter: invert(80%) !important;
                    }

                     .changesets .row
                     {
                        font-size: small !important;
                    }

                    .text-dark,
                    .geolink {
                        color: ${primaryFontColor} !important;
                    }

                    li.selected {
                        background-color: ${activeElemColor} !important;
                    }

                    .browse-tag-k,
                    .browse-tag-v {
                        background-color: ${darkColorSecondary} !important;
                        border-bottom: 1px solid ${darkColor} !important;
                        border-left: 0 !important;
                        height: 40px !important;
                    }

                    .browse-tag-list {
                        color: #e9ecef !important;
                        font-size: small !important;
                        border: 1px solid ${darkColor} !important;
                        background-color: ${darkColorSecondary} !important;
                    }

                    .search_form,
                    .directions_form,
                    .layers-ui .base-layers li label,
                    .ideditor input[type="search"],
                    .field-label,
                    .body.small-nav header,
                    body.small-nav header {
                        background-color: ${darkColor} !important;
                        color: ${primaryFontColor} !important;
                    }

                    #sidebar_content .note-comments li p,
                    #sidebar_content .list-unstyled {
                        border-left: 5px solid ${osmGreenColor} !important;
                        padding: 10px !important;
                        background-color: ${darkColorSecondary} !important;
                        border-radius: 0.25rem !important;
                        font-size: small !important;
                    }

                    #sidebar_content h4 {
                        font-size: medium !important;
                    }

                    #sidebar_content h2 {
                        font-size: large !important;
                    }

                    #sidebar_content bdi {
                        padding: 2px;
                        font-weight: 600;
                    }

                    #sidebar_content a {
                        color: ${linkColor} !important;
                        text-decoration: underline dotted !important;
                    }

                    .list-unstyled,
                    .list-unstyled li {
                        background-color: ${darkColorSecondary} !important;
                        padding: 5px !important;
                    }

                    .ideditor .sidebar,
                    .ideditor .fillL,
                    .bg-light {
                        background-color: ${darkColor} !important;
                        color: ${primaryFontColor} !important;
                    }

                    .ideditor button,
                    #map-ui,
                    .ideditor .preset-list-button-wrap,
                    .ideditor .preset-list-button .label,
                    .ideditor .section .grouped-items-area,
                    .map-layout #sidebar,
                    .content-heading,
                    .table-light,
                    .leaflet-popup-content-wrapper
                    {
                        background: ${darkColorSecondary} !important;
                        color: ${primaryFontColor} !important;
                        border: 1px solid ${darkColor} !important;
                    }
                    .messages .inbox-row
                    {
                        background-color: #212529;
                    }
        `;

        GM_addStyle(css);

         // Find the <html> element
        const htmlElement = document.querySelector('html');
        const userButton = document.querySelector('.border-grey');

        // Check if the <html> element exists
        if (htmlElement) {
            // Add data-bs-theme="dark" attribute to the <html> tag
            htmlElement.setAttribute('data-bs-theme', 'dark');
        }

        if (userButton) {
             userButton.classList.remove('bg-white', 'text-secondary', 'border-grey');
        }

        const checkElement = async selector => {
            while (document.querySelector(selector) === null) {
                await new Promise(resolve => requestAnimationFrame(resolve))
            }
            return document.querySelector(selector);
        };

        const checkElements = async selector => {
            while (document.querySelectorAll(selector) === null) {
                await new Promise(resolve => requestAnimationFrame(resolve))
            }
            return document.querySelectorAll(selector);
        };

        checkElement('body').then((selector) => {
            selector.classList.add("bg-dark");
        });


        function createButton(buttonLink, buttonTitle, buttonBg) {
            let link = document.createElement("a");
            let infoBadge = document.createElement("span");
            infoBadge.classList.add("badge", `bg-${buttonBg}`, "text-dark", "m-1", "p-1");
            link.innerText = buttonTitle;
            link.href = buttonLink;
            link.target = "_blank";
            infoBadge.appendChild(link);
            return infoBadge;
        }

        function gmMain() {
            const getPathIdAndType = () => {
                const path = window.location.pathname;
                const type = path.split('/')[1];
                const id = path.split('/')[2].replace('/history', '');
                return { type, id };
            };

            const createHistoryButton = (url, label, style) => {
                const { type } = getPathIdAndType();
                checkElement(`.browse-${type}`).then((selector) => {
                    const button = createButton(url, label, style);
                    selector.prepend(button);
                });
            };

            const createDeepHistoryButton = (url, label, style) => {
                const { type } = getPathIdAndType();
                checkElement(`.browse-${type}`).then((selector) => {
                    const button = createButton(url, label, style);
                    selector.prepend(button);
                });
            };

            const { type, id } = getPathIdAndType();

            if (type === 'changeset') {
                createHistoryButton(`https://osmcha.org/changesets/${id}/`, 'OSMCha', 'info');
                createHistoryButton(`https://overpass-api.de/achavi/?changeset=${id}`, 'Achavi', 'warning');
                createHistoryButton(`https://resultmaps.neis-one.org/osm-change-viz?c=${id}`, 'Change Viz', 'primary');
            } else if (type === 'relation') {
                createHistoryButton(`http://ra.osmsurround.org/analyzeRelation?relationId=${id}&_noCache=on`, 'RelationAnalyzer', 'info');
                createHistoryButton(`https://pewu.github.io/osm-history/#/relation/${id}`, 'OSM-History', 'warning');
                createHistoryButton(`https://osmlab.github.io/osm-deep-history/#/relation/${id}`, 'Deep History', 'primary');
            } else if (type === 'node') {
                createDeepHistoryButton(`https://osmlab.github.io/osm-deep-history/#/node/${id}`, 'Deep History', 'primary');
                createHistoryButton(`https://pewu.github.io/osm-history/#/node/${id}`, 'OSM-History', 'info');
            } else if (type === 'way') {
                createDeepHistoryButton(`https://osmlab.github.io/osm-deep-history/#/way/${id}`, 'Deep History', 'primary');
                createHistoryButton(`https://pewu.github.io/osm-history/#/way/${id}`, 'OSM-History', 'info');
            }
        }

        // MENU - new elements
        checkElement('nav.primary').then((selector) => {
            const userName = document.querySelector(".username").innerText.trim();

            const createButton = (text, href, classes) => {
                const button = document.createElement("a");
                button.classList.add(...classes);
                button.innerText = text;
                button.href = href;
                return button;
            };

            const changesNode = document.createElement("div");
            changesNode.classList.add("btn-group", "pr-1");
            const toolsNode = document.createElement("div");
            toolsNode.classList.add("btn-group");

            const changesLink = createButton('Moje zmiany', `/user/${userName}/history`, ["btn", "btn-outline-info", "geolink", "text-light"]);
            const contributionLink = createButton('Mój wkład', `http://hdyc.neis-one.org/?${userName}`, ["btn", "btn-outline-info", "text-light"]);
            contributionLink.target = "_blank";
            const notesLink = createButton('Losowa uwaga', 'https://brzozo.ws/random-note/PL', ["btn", "btn-outline-warning", "text-light"]);

            changesNode.appendChild(changesLink);
            changesNode.appendChild(contributionLink);
            toolsNode.appendChild(notesLink);
            selector.appendChild(changesNode);
            selector.appendChild(toolsNode);
        });

    })();
