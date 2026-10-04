(function(){let C=null;const x=window.essentialCountdownTimerMeta,N=window.essentialCountdownTimerPageTemplate||"";async function H(){const e=window.Shopify?window.Shopify.shop:window.location.origin,t=Array.isArray(window.essentialCountdownTimerConfigs)?window.essentialCountdownTimerConfigs.filter(r=>!String(r?.id??"").startsWith("keystone")):window.essentialCountdownTimerConfigs,n=t&&me(t),o=`https://cache-essential-apps.cc/config/${e}`;return n?(n.find(a=>a.locationType&&a.locationType==="on-countries")&&await fetch("https://cache-essential-apps.cc/config/geolocation").then(a=>{a.headers.has("country")&&(C=a.headers.get("country"))}),new Promise(a=>{a(n)})):e?fetch(o).then(r=>(r.headers.has("country")&&(C=r.headers.get("country")),r.json().then(me))):new Promise(r=>{r([])})}function G(e){const t=document.getElementsByTagName("head")[0],n=document.createElement("style");n.setAttribute("type","text/css"),n.setAttribute("id","countdown_timer"),n.styleSheet?n.styleSheet.cssText=e:n.appendChild(document.createTextNode(e)),t.appendChild(n)}function V(e){return e.backgroundType==="imageBackground"?"":e.backgroundType==="gradientBackground"?`background: linear-gradient(${e.gradientTurn}deg, ${e.gradientStart}, ${e.gradientEnd});`:e.backgroundType==="singleBackground"?(e.singleColorAlpha||parseFloat(e.singleColorAlpha)===0)&&parseFloat(e.singleColorAlpha)<1?`background: ${e.singleColorRgba};`:`background: ${e.singleColor};`:`background: ${e.singleColor};`}const we="https://essential-apps-analytics.herokuapp.com";function he(e){const t=window.essentialCountdownTimerConfigs;return Array.isArray(t)?t.find(n=>String(n?.id)===String(e)):null}function q(e){return e?!!e.closest('#essential-cart-drawer-portal, [data-essential-cart-element="cart-drawer-content"]'):!1}const z=new Set;function R(e){if(!e?.isConnected)return!1;const t=e.getBoundingClientRect();if(t.width<=0||t.height<=0)return!1;let n=e;for(;n&&n!==document.documentElement;){if(n.hidden||n.inert||n.getAttribute("aria-hidden")==="true")return!1;const o=window.getComputedStyle(n);if(o.display==="none"||o.visibility==="hidden"||o.visibility==="collapse"||parseFloat(o.opacity)===0||n.tagName==="DIALOG"&&!n.open)return!1;n=n.parentElement}return!0}function ye(e){return e.node?e.node:e.target?.closest&&e.target.closest(".essential_countdown_cart_page_timer")||e.target}function _e(e,t){const n=String(e?.id||"");return!n||z.has(n)||!R(t)?!1:(z.add(n),D(e,"view",{node:t}),!0)}function be(e,t){const n=String(e?.id||"");if(n&&z.has(n)||typeof IntersectionObserver!="function"||!t)return;new IntersectionObserver((r,a)=>{if(!t.isConnected){a.disconnect();return}for(const s of r)if(s.isIntersecting&&_e(e,t)){a.disconnect();break}},{threshold:.1}).observe(t)}function D(e,t,n){const o=n||{};if(!e||!t||(o.sideCart||q(o.target))&&!R(ye(o))||Shopify?.previewMode===!0||Shopify?.designMode===!0||Shopify?.shop==="rationalacoustics.myshopify.com")return;const r=window.Shopify?.shop,a=e.id;if(!r||!a)return;const s=new URLSearchParams;s.set("event",t),s.set("shop",r),s.set("id",String(a)),s.set("name",String(e.name||e.title||"").substring(0,250)),s.set("type",String(e.type||"")),s.set("ctaType",String(e.CTAType||""));const c=window.essentialAnalyticsBaseUrl||we;navigator.sendBeacon(`${c}/post_event`,s)}function ee(e){return`essentialTimerCompleted-${e.id}-${e.updatedAt}`}function te(e){try{window.sessionStorage.removeItem(ee(e))}catch{window.essentialTimerCompletedIds&&delete window.essentialTimerCompletedIds[String(e.id)]}}function W(e,t){const n=t||{};if(n.sideCart&&!R(n.node))return;const o=ee(e);try{if(window.sessionStorage.getItem(o))return;window.sessionStorage.setItem(o,"1")}catch{window.essentialTimerCompletedIds=window.essentialTimerCompletedIds||{};const a=String(e.id);if(window.essentialTimerCompletedIds[a])return;window.essentialTimerCompletedIds[a]=!0}D(e,"countdown_complete",n)}function ne(e,t,n){t||q(n)||setTimeout(()=>{if(n&&!n.isConnected)return;const o=String(e?.id||"");o&&z.has(o)||(o&&z.add(o),D(e,"view"))},700)}function fe(){window.essentialTimerClicksBound||(window.essentialTimerClicksBound=!0,document.addEventListener("click",e=>{const t=e.target.closest('[class*="countdown_annoucement_bar_cta_"], [class*="countdown_timer_bar_cta_"]');if(t){const o=(t.className||"").match(/countdown_(?:annoucement_bar|timer_bar)_cta_(.+)/),r=o&&o[1],a=r&&he(r);if(a){if(q(e.target)){const s=e.target.closest(".essential_countdown_cart_page_timer");if(!R(s||e.target))return}D(a,"click_cta_button",{target:e.target})}}},!0))}function I(e){return e.font!==""&&e.font?`font-family: ${e.font};
`:""}function O(e){const t=e.style||{},n=t.layout||"Standard",o=t.timerStyleType||"Plain",r=t.timerBgColor||"#E1E2EE",a=t.timerBorderRadius||"8",s=parseInt(t.timerSize)||24,c=!!(e.legendCopyDays||e.legendCopyHours||e.legendCopyMins||e.legendCopySecs);return{layout:n,timerStyleType:o,timerBgColor:r,timerBorderRadius:a,tSize:s,hasLabels:c}}function re(e){const t=e.style,{timerStyleType:n,timerBgColor:o,timerBorderRadius:r,tSize:a,hasLabels:s}=O(e);return`
      ${n==="Grouped"?`
      .countdown_grouped_container_${e.id} {
          display: inline-flex;
          align-items: center;
          gap: ${Math.round(a/8)}px;
          background: ${o};
          border-radius: ${r}px;
          padding: ${Math.round(a/4)}px;
      }`:""}

      ${n==="Boxes"?`
      .countdown_timer_boxes_outer_${e.id} {
          display: flex;
          gap: ${Math.round(a/(s?4:8))}px;
          align-items: flex-start;
          direction: ltr;
      }
      .countdown_timer_box_cell_${e.id} {
          display: flex;
          flex-direction: column;
          align-items: center;
      }
      .countdown_timer_box_item_${e.id} {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: ${o};
          border-radius: ${r}px;
          padding: ${Math.round(a/4)}px;
      }
      .countdown_timer_box_legend_${e.id} {
          color: ${t.legendColor};
          font-size: ${t.legendSize}px;
          padding-top: ${Math.round(a/8)}px;
          text-align: center;
          line-height: 1;
      }`:""}
    `}function oe(e,t,n){const o=e.style,{tSize:r,timerStyleType:a,hasLabels:s}=O(e),c=n==="Inline",u=t!=="top-bar"&&n==="Standard"&&a!=="Grouped";return`
      .countdown_wrapper_${e.id} {
          ${c?`display: flex; align-items: center; gap: ${Math.round(r/(s?4:8))}px;`:`display: grid;
          ${S(e)?"grid-template-columns: 1fr 10px 1fr 10px 1fr;":"grid-template-columns: 1fr 10px 1fr 10px 1fr 10px 1fr;"}
          row-gap: ${s?`${Math.round(r/8)}px`:"0"};
          justify-items: center;
          align-items: center;
          column-gap: ${Math.round(r/8)}px;
          direction: ltr;
          ${u?"padding-top: 4px;":""}
          ${t!=="top-bar"&&!e.subheading&&!e.title&&"padding-top: 0;"}`}
      }

      .countdown_time_${e.id} {
          ${I(o)}color: ${o.timerColor};
          font-weight: bold;
          font-size: ${o.timerSize}px;
          line-height: 1;
          font-feature-settings: 'tnum';
          font-variant-numeric: tabular-nums;
          width: 2ch;
          white-space: nowrap;
          text-align: center;
      }

      .countdown_legend_${e.id} {
          ${I(o)}color: ${o.legendColor};
          font-size: ${o.legendSize}px;
          ${c?"":"padding-right: 10px; grid-column: 2 span;"}
          line-height: 1;
      }

      ${c?"":`
      .countdown_legend_${e.id}.last {
        grid-column: auto;
        padding-right: 0;
      }`}

      .countdown_separator_${e.id} {
          ${I(o)}color: ${o.timerColor};
          font-size: ${o.timerSize}px;
          font-weight: normal;
          line-height: 0.8;
      }

      ${Shopify.shop==="df8f6b-2.myshopify.com"?`.essential_countdown_annoucement_bar_wrapper > div:nth-of-type(2) .essential_countdown_timer {display: none;}
      .essential_countdown_annoucement_bar_wrapper > div:nth-of-type(2) .essential_countdown_timer:last-of-type {display: grid;}`:""}`}function ae(e){const t=e.style,{layout:n}=O(e),o=n==="Standard",r=n==="Balanced",a=`
        .countdown_timer_wrapper_${e.id} {
            display: flex;
            flex-flow: ${o?"column":"row wrap"};
            ${r?"justify-content: space-between;":n==="Inline"?"justify-content: center;":""}
            align-items: center;
            ${o?"":e.type==="landing-page"?"gap: 12px 16px;":"gap: 2px 4px;"}
            text-align: ${o?"center":"left"};
            ${I(t)}
            ${V(t)}
            ${t.insideTopSpacing!==void 0?`margin-top: ${t.outsideTopSpacing}px;
                   margin-bottom: ${t.outsideBottomSpacing}px;
                   padding-top: ${t.insideTopSpacing}px;
                   padding-bottom: ${t.insideBottomSpacing}px;
                   padding-left: ${t.insideLeftSpacing??16}px;
                   padding-right: ${t.insideRightSpacing??16}px;
                `:`margin: 20px 0;
                   padding: 30px;`}
            border-radius: ${t.borderRadius}px;
            border: ${t.borderColor} solid ${t.borderSize}px;
            flex: auto;
            position: relative;
            overflow: hidden;
        }

        .countdown_timer_wrapper_${e.id}.clickable {
          cursor: pointer;
        }

        .countdown_timer_wrapper_${e.id} h2 {
            ${I(t)}font-weight: bold;
            font-size: ${t.titleSize}px;
            color: ${t.titleColor};
            margin: 0;
            padding: 0;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
        }

        .countdown_timer_subheading_${e.id} {
            ${I(t)}font-size: ${t.subheadingSize}px;
            color: ${t.subheadingColor};
            line-height: 1.5;
            letter-spacing: normal;
            padding: 0;
            margin: 0;
        }

        .countdown_timer_bar_cta_${e.id}, .countdown_timer_bar_cta_${e.id}:visited {
          display: block;
          cursor: pointer;
          text-decoration: none;
          background: ${t.buttonBackgroundColor};
          border: 0;
          white-space: nowrap;
          padding: ${n==="Inline"?"2px 8px":"8px 16px"};
          line-height: 1.5;
          border-radius: ${t.buttonBorderRadius}px;
          font-size: ${t.buttonFontSize}px;
          color: ${t.buttonFontColor};
          margin-top: ${n==="Inline"?"0":r?"10px":"20px"};
        }

        /* Balanced layout: text+subheading column on the left */
        .countdown_timer_text_content_${e.id} {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }

        ${re(e)}

        ${oe(e,"product-page",n)}
    `;G(a)}function ge(e){const t=e.style,{layout:n}=O(e),o=a=>{if(!a.createdAt||new Date(a.createdAt).getTime()<1697704508e3)return"";const s=!a.legendCopyDays&&!a.legendCopyHours&&!a.legendCopyMins&&!a.legendCopySecs;return`
        @media (max-width: 620px) {
          .countdown_annoucement_bar_wrapper_${a.id} {
            padding: 7px;
            column-gap: 10px;
            row-gap: 4px;
          }

          span.countdown_time_${a.id} {
            font-size: ${Math.floor(t.timerSize*.8)}px;
            padding-top: ${s?0:"2px"};
          }

          div.countdown_legend_${a.id} {
            font-size: ${Math.floor(t.legendSize*.8)}px;
          }

          .countdown_annoucement_bar_title_${a.id}.h2 {
            font-size: ${Math.floor(t.titleSize*.8)}px;
          }

          .countdown_annoucement_bar_subheading_${a.id} {
            font-size: ${Math.floor(t.subheadingSize*.8)}px;
          }

          .countdown_annoucement_bar_cta_${a.id}, .countdown_annoucement_bar_cta_${a.id}:visited  {
            padding: 6px 14px;
            line-height: 1.5;
            font-size: ${Math.floor(t.buttonFontSize*.9)}px;
          }
        }`},r=`
        .countdown_annoucement_bar_wrapper_${e.id} {
          position: relative;
          ${I(t)}
          ${V(t)}
          z-index: ${!e.createdAt||new Date(e.createdAt).getTime()<1697704508e3?100:1};
          display: flex !important;
          width: 100%;
          flex-wrap: wrap;
          ${t.announcementBarStyle==="seperate-centered"?`flex-flow: column;
              justify-items: center;`:""}

          align-items: center;
          justify-content: ${n==="Balanced"?"space-between":"center"};
          padding-top: ${t.insideTopSpacing??10}px;
          padding-bottom: ${t.insideBottomSpacing??10}px;
          padding-left: ${t.insideLeftSpacing??(n==="Balanced"?30:10)}px;
          padding-right: ${t.insideRightSpacing??(n==="Balanced"?30:10)}px;
          column-gap: 16px;
          row-gap: 4px;
          border-bottom: ${t.borderColor} solid ${t.borderSize}px;
        }

        .countdown_annoucement_bar_wrapper_${e.id}.top_page {
          position: sticky;
          top: 0;
        }

        .countdown_annoucement_bar_wrapper_${e.id}.bottom_page {
          bottom: 0;
          left: 0;
          position: fixed;
          width: 100%;
          border-bottom: none;
          border-top: ${t.borderColor} solid ${t.borderSize}px;
        }

        .countdown_annoucement_bar_wrapper_${e.id}.clickable {
          cursor: pointer;
        }

        .countdown_annoucement_bar_title_${e.id}.h2 {
            ${I(t)}font-weight: bold;
            font-size: ${t.titleSize}px;
            color: ${t.titleColor};
            margin: 0;
            padding: 0;
            line-height: 1.2;
            letter-spacing: normal;
            text-transform: none;
            text-align: left;
        }

        .countdown_annoucement_bar_subheading_${e.id} {
            ${I(t)}font-size: ${t.subheadingSize}px;
            color: ${t.subheadingColor};
            line-height: 1.2;
            letter-spacing: normal;
            padding: 0;
            margin: 0;
        }

        .countdown_annoucement_bar_cta_${e.id}, .countdown_annoucement_bar_cta_${e.id}:visited  {
          display: block;
          cursor: pointer;
          text-decoration: none;
          background: ${t.buttonBackgroundColor};
          border: 0;
          white-space: nowrap;
          padding: ${n==="Inline"?"2px 8px":"8px 16px"};
          line-height: 1.5;
          border-radius: ${t.buttonBorderRadius}px;
          font-size: ${t.buttonFontSize}px;
          color: ${t.buttonFontColor};
        }

        .countdown_annoucement_bar_close_button_${e.id} {
          position: absolute;
          display: block;
          border: none;
          background: none;
          padding: 6px;
          cursor: pointer;
          top: 50%;
          right: 10px;
          transform: translate(0, -50%);
        }

        .countdown_annoucement_bar_close_button_${e.id} svg {
          width: 12px;
          height: 12px;
          display: block;
        }

        .countdown_annoucement_bar_close_button_${e.id}.top_right {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        ${o(e)}

        @media (max-width: 430px) {
          .countdown_annoucement_bar_wrapper_${e.id} {
            justify-items: center;
            text-align: center;
            padding: 10px 15px;
          }

          .countdown_annoucement_bar_close_button_${e.id} {
            position: absolute;
            padding: 0;
            transform: none;
            top: 5px;
            right: 5px;
          }

          .countdown_annoucement_bar_title_${e.id}.h2 {
              text-align: center;
          }
        }

        ${re(e)}

        ${oe(e,"top-bar",n)}
    `;G(r)}function $e(e){const t=e.style,{timerStyleType:n,timerBgColor:o,timerBorderRadius:r,tSize:a}=O(e),s=`
        .countdown_cart_page_timer_wrapper_${e.id} {
            ${I(t)}
            ${V(t)}
            ${`margin-top: ${t.outsideTopSpacing}px;
                margin-bottom: ${t.outsideBottomSpacing}px;
                padding-top: ${t.insideTopSpacing}px;
                padding-bottom: ${t.insideBottomSpacing}px;
                padding-left: 10px;
                padding-right: 10px;
              `}
            border-radius: ${t.borderRadius}px;
            border: ${t.borderColor} solid ${t.borderSize}px;
            text-align: center;
            flex: auto;
            align-items: center;
            position: relative;
            overflow: hidden;
        }

        [data-essential-cart-element="cart-drawer-empty"] .countdown_cart_page_timer_wrapper_${e.id} {
          display: none;
        }

        .countdown_cart_page_timer_wrapper_${e.id} .h2 {
          ${I(t)}font-weight: bold;
          font-size: ${t.titleSize}px;
          color: ${t.titleColor};
          margin: 0;
          padding: 0;
          line-height: 1.2;
          letter-spacing: normal;
          text-transform: none;
          white-space: break-spaces;
        }

        .countdown_wrapper_${e.id} {
          white-space: nowrap;
        }

        .countdown_time_${e.id} {
          ${I(t)}color: ${t.timerColor};
          font-weight: bold;
          font-size: ${t.timerSize}px;
          line-height: 1;
          font-feature-settings: 'tnum';
          font-variant-numeric: tabular-nums;
          width: 2ch;
          white-space: nowrap;
          text-align: center;
        }

        .countdown_separator_${e.id} {
          color: ${t.timerColor};
          font-size: ${t.timerSize}px;
          font-weight: normal;
          line-height: 0.8;
        }

        ${n==="Grouped"?`
        .countdown_grouped_container_${e.id} {
            display: inline-flex;
            align-items: center;
            gap: ${Math.round(a/8)}px;
            background: ${o};
            border-radius: ${r}px;
            padding: ${Math.round(a/4)}px;
        }`:""}

        ${n==="Boxes"?`
        .countdown_timer_box_item_${e.id} {
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            background: ${o};
            border-radius: ${r}px;
            padding: ${Math.round(a/4)}px;
        }`:""}`;G(s)}function F(e){return e.toString().length===1?`0${e}`:e}function Te(e){let t,n;e.type==="product-page"||e.type==="landing-page"?(t=document.querySelector(`.countdown_timer_wrapper_${e.id} h2`)||document.querySelector(`.countdown_timer_title_${e.id}`),n=document.querySelector(`.countdown_timer_subheading_${e.id}`)):(t=document.querySelector(`.countdown_annoucement_bar_title_${e.id}`),n=document.querySelector(`.countdown_annoucement_bar_subheading_${e.id}`)),n&&n.remove(),t&&(t.textContent=e.customTitle)}function B(e,t,n,o=null){let r;const a=new Date(e+n.fixedMinutes*6e4),s=new Date().getTime();if(n.timerType==="toDate")r=new Date(n.endDate)-s;else if(n.timerType==="recurring"){const y=new Date(n.endDate)-s;if(n.endType!=="never"&&y<0)r=y;else{const l=L(n.startDate),p=L(n.endDate);l<p||p.getTime()>s?r=p-s:l.getTime()>s?r=0:r=p.getTime()+24*60*60*1e3-s}}else{t?r=a-(n.fixedMinutes*6e4-t)-s:r=a-s;try{n.type==="cart-page"&&o.item_count>0&&window.localStorage.setItem(`essentialCountdownTimer-${n.id}`,JSON.stringify({id:n.id,userDistance:r,sessionCurrentDate:new Date().getTime(),updatedAt:n.updatedAt})),n.type!=="cart-page"&&window.localStorage.setItem(`essentialCountdownTimer-${n.id}`,`${r}, ${new Date().getTime()}, ${n.timerType}-${n.fixedMinutes}-${n.id}`)}catch(y){console.log(y)}}if(r<0){if(n.onceItEnds==="custom-title"&&Te(n),n.onceItEnds==="hide"||n.onceItEnds===""||n.onceItEnds==="delete-items"){let y;n.type==="product-page"||n.type==="landing-page"?y=document.querySelector(`.countdown_timer_wrapper_${n.id}`):n.type==="cart-page"?(window.cartTimerObserver&&window.cartTimerObserver.disconnect(),y=document.querySelector(`.countdown_cart_page_timer_wrapper_${n.id}`)):y=document.querySelector(`.countdown_annoucement_bar_wrapper_${n.id}`),y&&y.remove()}n.onceItEnds==="delete-items"&&n.type==="cart-page"&&o.item_count>0&&clearCartEssentialApps(n);return}let c=Math.floor(r/(1e3*60*60*24));c=F(c);let u=Math.floor(r%(1e3*60*60*24)/(1e3*60*60));u=F(u);let w=Math.floor(r%(1e3*60*60)/(1e3*60));w=F(w);let _=Math.floor(r%(1e3*60)/1e3);return _=F(_),S(n)?{hours:u,minutes:w,seconds:_}:{days:c,hours:u,minutes:w,seconds:_}}function U(e,t){if(t.style.backgroundType!=="imageBackground")return;let n=t.style.imageOverlayColor;(t.style.imageOverlayColorAlpha||parseFloat(t.style.imageOverlayColorAlpha)===0)&&parseFloat(t.style.imageOverlayColorAlpha)<1&&(n=`linear-gradient(${t.style.imageOverlayColorRgba}, ${t.style.imageOverlayColorRgba})`),[...e.children].forEach(a=>{a.style.position="relative"});const o=document.createElement("div");o.style.position="absolute",o.style.top="0",o.style.left="0",o.style.width="100%",o.style.height="100%",o.style.background=n,e.insertBefore(o,e.firstChild);const r=document.createElement("img");r.src=t.style.image,r.classList.add("essential-countdown-timer-img-reset"),r.fetchpriority="high",r.style.width="100%",r.style.height="100%",r.style.objectFit="cover",r.style.zIndex="-1",r.style.position="relative",o.append(r)}function xe(e,t){if(t.style.backgroundType!=="imageBackground")return;let n=t.style.imageOverlayColor;(t.style.imageOverlayColorAlpha||parseFloat(t.style.imageOverlayColorAlpha)===0)&&parseFloat(t.style.imageOverlayColorAlpha)<1&&(n=`linear-gradient(${t.style.imageOverlayColorRgba}, ${t.style.imageOverlayColorRgba})`),[...e.children].forEach(a=>{a.style.position="relative",a.style.zIndex="2"});const o=document.createElement("img");o.src=t.style.image,o.classList.add("essential-countdown-timer-img-reset"),o.fetchpriority="high",o.style.position="absolute",o.style.top="0",o.style.left="0",o.style.width="100%",o.style.height="100%",o.style.objectFit="cover",o.style.zIndex="0",e.insertBefore(o,e.firstChild);const r=document.createElement("div");r.textContent="\u200B",r.style.position="absolute",r.style.top="0",r.style.left="0",r.style.width="100%",r.style.height="100%",r.style.background=n,r.style.zIndex="1",e.insertBefore(r,o.nextSibling)}function K(e,t,n){const o=n||{};let r=Number(new Date().getTime()),a,s,c,u;try{c=window.localStorage.getItem(`essentialCountdownTimer-${t.id}`)}catch(p){console.log(p)}c&&([a,s,u]=c&&c.split(","),u.indexOf(`${t.timerType}-${t.fixedMinutes}-${t.id}`)===-1&&(c=null,a=null)),c&&parseInt(s)+t.fixedMinutes*6e4>r&&(r=parseInt(s));const w=B(r,a,t);let _=!!w;se(w,e,t),ne(t,o.sideCart,e);let y=!1;const l=setInterval(()=>{const p=B(r,a,t);p&&(_=!0),(t.repeat||t.onceItEnds==="repeat")&&t.timerType==="fixedMinutes"&&!p?(!y&&_&&(y=!0,W(t,o)),te(t),a=0,r=Number(new Date().getTime()),y=!1,_=!1):p||(!y&&_&&(y=!0,W(t,o)),clearInterval(l)),se(B(r,a,t),e,t)},1e3)}function Se(e,t,n,o){const r=o||{};let a=Number(new Date().getTime()),s,c={};try{s=window.localStorage.getItem(`essentialCountdownTimer-${t.id}`)}catch(l){console.log(l)}if(s){try{const l=JSON.parse(s);c={...c,...l}}catch(l){console.log(l)}c&&c.id===t.id&&c.updatedAt!==t.updatedAt&&(window.localStorage.removeItem(`essentialCountdownTimer-${t.id}`),s=null,c={...c,userDistance:null})}s&&parseInt(c.sessionCurrentDate)+t.fixedMinutes*6e4>a&&(a=parseInt(c.sessionCurrentDate));const u=B(a,c.userDistance,t,n);let w=!!u;de(u,e,t),ne(t,r.sideCart,e);let _=!1;const y=setInterval(()=>{const l=B(a,c.userDistance,t,n);l&&(w=!0),(t.repeat||t.onceItEnds==="repeat")&&t.timerType==="fixedMinutes"&&!l?(!_&&w&&(_=!0,W(t,r)),te(t),c={...c,userDistance:0},a=Number(new Date().getTime()),_=!1,w=!1):l||(!_&&w&&(_=!0,W(t,r)),clearInterval(y)),de(B(a,c.userDistance,t,n),e,t)},1e3)}function ie(e,t,n,o){t.forEach((r,a)=>{const s=document.createElement("div");s.className=a===o?`countdown_legend_${n.id} last`:`countdown_legend_${n.id}`,Shopify?.shop==="sculpdus.myshopify.com"&&s.setAttribute("tabindex","-1"),s.textContent=r,e.append(s)})}function se(e,t,n){const{layout:o,timerStyleType:r,hasLabels:a,tSize:s}=O(n),c=o==="Inline";e||(e=S(n)?{hours:"00",minutes:"00",seconds:"00"}:{days:"00",hours:"00",minutes:"00",seconds:"00"});const u=!n.createdAt||new Date(n.createdAt).getTime()<17724528e5,w=typeof n.style?.hideDaysWhenZero=="boolean"?n.style.hideDaysWhenZero:!u,_=!S(n)&&(!w||e.days!=="00"),y=S(n)||_?Object.values(e):Object.values(e).slice(1),l=S(n)||!_?[n.legendCopyHours,n.legendCopyMins,n.legendCopySecs]:[n.legendCopyDays,n.legendCopyHours,n.legendCopyMins,n.legendCopySecs],p=y.length-1,$=Shopify?.shop==="92ejyc-mj.myshopify.com",A=(i,h=!1)=>{const g=document.createElement("span");return g.className=`countdown_time_${n.id}`,g.textContent=i,Shopify?.shop==="sculpdus.myshopify.com"&&g.setAttribute("tabindex","-1"),h&&g.setAttribute("aria-hidden","true"),g},v=()=>{const i=document.createElement("span");return i.className=`countdown_separator_${n.id}`,i.textContent=":",Shopify?.shop==="sculpdus.myshopify.com"&&(i.setAttribute("aria-hidden","true"),i.setAttribute("tabindex","-1")),i};if(r==="Plain"&&!c){const i=document.createElement("div");i.className=`countdown_wrapper_${n.id} essential_countdown_timer notranslate`,Shopify?.shop==="sculpdus.myshopify.com"&&i.setAttribute("aria-live","polite"),i.style.gridTemplateColumns=y.length===4?"1fr 10px 1fr 10px 1fr 10px 1fr":"1fr 10px 1fr 10px 1fr",y.forEach((h,g)=>{const b=document.createElement("span");b.className=`countdown_time_${n.id}`,b.textContent=h,Shopify?.shop==="sculpdus.myshopify.com"&&b.setAttribute("tabindex","-1"),$&&g===p&&b.setAttribute("aria-hidden","true"),i.append(b),g!==p&&i.append(v())}),ie(i,l,n,p),t.innerHTML="",t.append(i);return}if(r==="Boxes"&&!c){const i=document.createElement("div");i.className=`countdown_timer_boxes_outer_${n.id} essential_countdown_timer notranslate`,Shopify?.shop==="sculpdus.myshopify.com"&&i.setAttribute("aria-live","polite"),y.forEach((h,g)=>{const b=document.createElement("div");b.className=`countdown_timer_box_cell_${n.id}`;const d=document.createElement("div");d.className=`countdown_timer_box_item_${n.id}`,d.append(A(h,$&&g===p)),b.append(d);const f=document.createElement("div");if(f.className=`countdown_timer_box_legend_${n.id}`,f.textContent=l[g]||"",b.append(f),i.append(b),!a&&g!==p){const m=v();m.style.paddingTop=`${Math.round(s/4)}px`,m.style.paddingBottom=`${Math.round(s/4)}px`,i.append(m)}}),t.style.paddingTop=o==="Standard"&&(n.title||n.subheading)?"4px":"0",t.innerHTML="",t.append(i);return}if(c){const i=document.createElement("div");if(i.className=`countdown_wrapper_${n.id} essential_countdown_timer notranslate`,Shopify?.shop==="sculpdus.myshopify.com"&&i.setAttribute("aria-live","polite"),y.forEach((h,g)=>{if(r==="Boxes"){const b=document.createElement("div");b.className=`countdown_timer_box_item_${n.id}`,b.append(A(h,$&&g===p)),i.append(b)}else i.append(A(h,$&&g===p));if(a){const b=document.createElement("span");b.className=`countdown_legend_${n.id}`,b.textContent=l[g]||"",i.append(b)}else g!==p&&i.append(v())}),t.innerHTML="",r==="Grouped"){const h=document.createElement("div");h.className=`countdown_grouped_container_${n.id} essential_countdown_timer notranslate`,h.append(i),t.append(h)}else t.append(i);return}if(r==="Grouped"&&!c){const i=document.createElement("div");i.className=`countdown_wrapper_${n.id} essential_countdown_timer notranslate`,Shopify?.shop==="sculpdus.myshopify.com"&&i.setAttribute("aria-live","polite"),i.style.gridTemplateColumns=y.length===4?"1fr 10px 1fr 10px 1fr 10px 1fr":"1fr 10px 1fr 10px 1fr",i.style.paddingTop="0",y.forEach((g,b)=>{i.append(A(g,$&&b===p)),b!==p&&i.append(v())}),ie(i,l,n,p),t.style.paddingTop=o==="Standard"&&(n.title||n.subheading)?"4px":"0",t.innerHTML="";const h=document.createElement("div");h.className=`countdown_grouped_container_${n.id} essential_countdown_timer notranslate`,h.append(i),t.append(h)}}function de(e,t,n){const o=document.createElement("div");o.className="cart-page-inline-timer h2",e||(e=S(n)?{hours:"00",minutes:"00",seconds:"00"}:{days:"00",hours:"00",minutes:"00",seconds:"00"});const{timerStyleType:r,tSize:a}=O(n),s=e.days!=="00",c=e.hours!=="00",u=[...s?[e.days]:[],...c?[e.hours]:[],e.minutes,e.seconds],w=u.length-1,_=p=>{const $=document.createElement("span");return $.className=`countdown_time_${n.id}`,$.textContent=p,$},y=()=>{const p=document.createElement("span");return p.className=`countdown_separator_${n.id}`,p.textContent=":",p};let l;if(r==="Grouped"){const p=document.createElement("span");p.style.display="inline-flex",p.style.alignItems="center",p.style.gap="2px",p.style.direction="ltr",u.forEach(($,A)=>{p.append(_($)),A!==w&&p.append(y())}),l=document.createElement("span"),l.className=`countdown_grouped_container_${n.id}`,l.append(p)}else if(r==="Boxes"){const p=Math.round(a/4);l=document.createElement("span"),l.style.display="inline-flex",l.style.alignItems="center",l.style.gap="2px",l.style.direction="ltr",u.forEach(($,A)=>{const v=document.createElement("span");if(v.className=`countdown_timer_box_item_${n.id}`,v.append(_($)),l.append(v),A!==w){const i=y();i.style.paddingTop=`${p}px`,i.style.paddingBottom=`${p}px`,l.append(i)}})}else l=document.createElement("span"),l.style.display="inline-flex",l.style.alignItems="center",l.style.gap="2px",l.style.direction="ltr",u.forEach((p,$)=>{l.append(_(p)),$!==w&&l.append(y())});t.innerHTML="",De(o,n.title,l),t.append(o)}function Ce(e){const t=document.createElementNS("http://www.w3.org/2000/svg","svg"),n=document.createElementNS("http://www.w3.org/2000/svg","path");return t.setAttribute("width",12),t.setAttribute("height",12),t.setAttribute("fill","none"),n.setAttribute("d","m7.414 6 4.293-4.293A.999.999 0 1 0 10.293.293L6 4.586 1.707.293A.999.999 0 1 0 .293 1.707L4.586 6 .293 10.293a.999.999 0 1 0 1.414 1.414L6 7.414l4.293 4.293a.997.997 0 0 0 1.414 0 .999.999 0 0 0 0-1.414L7.414 6Z"),n.setAttribute("fill",e),t.append(n),t}function le(e,t=null){if(document.querySelector(".essential_countdown_annoucement_bar_wrapper")&&!t)return;try{let l=window.localStorage.getItem("countdownTimerAnnoucementBarClosed");if(l=JSON.parse(l),l&&l.id===e.id&&l.updatedAt===e.updatedAt&&l.value)return}catch(l){console.log(l)}if(e.timerPlacement){const l=window.location.pathname;let p=window?.Shopify?.routes?.root||"/";const $=p;if(p.length>1&&(p=p.slice(0,p.length-1)),e.timerPlacement==="home-page"&&l!==p&&l!==$||e.timerPlacement==="all-products"&&!window.location.pathname.includes("/products/")||e.timerPlacement==="all-products"&&window.location.pathname.includes("/products/")&&e.excludeOnProducts?.find(v=>Number(v.id.split("/").pop())===window.essentialProductId)||e.timerPlacement==="all-collections"&&(!window.location.pathname.includes("/collections/")||window.location.pathname.includes("/products/")))return}else{const l=N.startsWith("index")&&e.excludeOnPages?.includes("home-page")||N.startsWith("collection")&&e.excludeOnPages?.includes("all-collections")||N.startsWith("product")&&e.excludeOnPages?.includes("all-products")||N.startsWith("blog")&&e.excludeOnPages?.includes("blogs")||N.startsWith("article")&&e.excludeOnPages?.includes("posts")||N.startsWith("cart")&&e.excludeOnPages?.includes("cart")||N.startsWith("search")&&e.excludeOnPages?.includes("search")||N.startsWith("404")&&e.excludeOnPages?.includes("404"),p=e.excludeOnSpecificUrls?.some(i=>window.location.href.includes(i)),$=window.location.pathname.split("/"),A=e.excludeOnKeywordsInUrl?.some(i=>$.includes(i));if(l||p||A)return}ge(e);const o=l=>l.includes("http://")||l.includes("https://")?l:l.startsWith("/")?l.replace("/",Shopify?.routes?.root||"/"):l,r=document.createElement("div");if(r.className=`essential_countdown_annoucement_bar_wrapper countdown_annoucement_bar_wrapper_${e.id}`,Shopify?.shop==="sculpdus.myshopify.com"&&(r.setAttribute("role","region"),r.setAttribute("aria-labelledby","timer-title")),e.style.position==="top-page"&&e.style.stickyBar&&(r.className+=" top_page"),e.style.position==="bottom-page"&&(r.className+=" bottom_page"),e.CTAType==="clickable"&&M(e.CTALink)){const l=M(e.CTALink);r.className+=" clickable",r.addEventListener("click",p=>{p.target.closest("button")||D(e,"click_cta_button",{target:p.target}),essentialCountdownCloseAnnouncementBarOnClick(p,l)})}const{layout:a}=O(e);let s=document.createElement("p");s.className+=`countdown_annoucement_bar_title_${e.id} h2`,s.textContent+=e.title,Shopify?.shop==="sculpdus.myshopify.com"&&(s.setAttribute("id","timer-title"),s.setAttribute("role","heading"),s.setAttribute("aria-level","2"));let c=document.createElement("p");c.className=`countdown_annoucement_bar_subheading_${e.id}`,c.textContent+=e.subheading;const u=document.createElement("div");let w=document.createElement("a");w.className=`countdown_annoucement_bar_cta_${e.id}`,Shopify?.shop==="homonaturals-test.myshopify.com"||Shopify?.shop==="glapru-amsterdam.myshopify.com"?w.setAttribute("href",o(M(e.CTALink))):w.setAttribute("href",M(e.CTALink)),w.textContent+=e.buttonText;let _=document.createElement("button");if(_.className=`countdown_annoucement_bar_close_button_${e.id}`,_.setAttribute("aria-label","Close timer bar"),_.addEventListener("click",l=>{l.stopPropagation(),D(e,"click_close_button"),essentialCountdownCloseAnnouncementBar(e.id,e.updatedAt)}),_.append(Ce(e.style.closeIconColor)),a==="Inline")r.append(s),r.append(u),e.subheading&&r.append(c);else{const l=document.createElement("div");l.append(s),e.subheading&&l.append(c),r.append(l),r.append(u)}e.CTAType==="button"&&r.append(w),e.closeButton&&r.append(_);const y=document.querySelector(".essential-countdown-top-bar");y?y.append(r):t?t.append(r):document.querySelector("body").prepend(r),K(u,e),U(r,e)}async function ce(e,t,n){if(n&&e.productTags&&e.productTags.length>0){const w=(window.essentialProductTags||[]).map(y=>y.toLowerCase());if(!e.productTags.some(y=>w.includes(y.toLowerCase())))return!1}if(e.excludeOnProducts?.find(u=>Number(u.id.split("/").pop())===window.essentialProductId))return!1;if(document.querySelector(`.countdown_timer_wrapper_${e.id}`))return;const{layout:a}=O(e),s=document.createElement("div");s.className=`countdown_timer_wrapper_${e.id}`;const c=document.createElement("div");if(a==="Balanced"){const u=document.createElement("div");u.className=`countdown_timer_text_content_${e.id}`;const w=document.createElement("h2");if(w.textContent+=e.title,u.append(w),e.subheading){const _=document.createElement("p");_.className=`countdown_timer_subheading_${e.id}`,_.textContent+=e.subheading,u.append(_)}s.append(u),s.append(c)}else if(a==="Inline"){const u=document.createElement("span");u.className=`countdown_timer_title_${e.id}`;const w=e.style;if(u.style.fontWeight="bold",u.style.fontSize=`${w.titleSize}px`,u.style.color=w.titleColor,u.style.lineHeight="1.5",u.textContent+=e.title,s.append(u),e.subheading){const _=document.createElement("p");_.className=`countdown_timer_subheading_${e.id}`,_.textContent+=e.subheading,s.append(_)}s.append(c)}else{const u=document.createElement("h2");if(u.textContent+=e.title,s.append(u),e.subheading){const w=document.createElement("p");w.className=`countdown_timer_subheading_${e.id}`,w.textContent+=e.subheading,s.append(w)}s.append(c)}ae(e),t.append(s),K(c,e),U(s,e)}function J(e,t,n=!0){const{layout:o}=O(e),r=document.createElement("div");if(r.className=`countdown_timer_wrapper_${e.id}`,e.CTAType==="clickable"&&M(e.CTALink)){const c=M(e.CTALink);r.className+=" clickable",r.addEventListener("click",u=>{u.target.closest("button")||D(e,"click_cta_button",{target:u.target}),essentialCountdownCloseAnnouncementBarOnClick(u,c)})}const a=document.createElement("div"),s=document.createElement("a");if(s.className=`countdown_timer_bar_cta_${e.id}`,s.setAttribute("href",M(e.CTALink)),s.textContent+=e.buttonText,o==="Balanced"){const c=document.createElement("div");c.className=`countdown_timer_text_content_${e.id}`;const u=document.createElement("h2");if(u.textContent+=e.title,c.append(u),e.subheading){const w=document.createElement("p");w.className=`countdown_timer_subheading_${e.id}`,w.textContent+=e.subheading,c.append(w)}e.CTAType==="button"&&c.append(s),r.append(c),r.append(a)}else if(o==="Inline"){const c=e.style,u=document.createElement("span");if(u.className=`countdown_timer_title_${e.id}`,u.style.fontWeight="bold",u.style.fontSize=`${c.titleSize}px`,u.style.color=c.titleColor,u.style.lineHeight="1.5",u.textContent+=e.title,r.append(u),e.subheading){const w=document.createElement("p");w.className=`countdown_timer_subheading_${e.id}`,w.textContent+=e.subheading,r.append(w)}r.append(a),e.CTAType==="button"&&r.append(s)}else{const c=document.createElement("h2");if(c.textContent+=e.title,r.append(c),e.subheading){const u=document.createElement("p");u.className=`countdown_timer_subheading_${e.id}`,u.textContent+=e.subheading,r.append(u)}r.append(a),e.CTAType==="button"&&r.append(s)}ae(e),n?t.append(r):t.prepend(r),K(a,e),U(r,e)}async function P(e,t,n){const o=await getCartEssentialApps();if(o&&o.item_count<1){try{window.localStorage.removeItem(`essentialCountdownTimer-${e.id}`)}catch(u){console.log(u)}return}if(document.querySelector(".essential_countdown_cart_page_timer"))return;const a=document.createElement("div");a.className=`essential_countdown_cart_page_timer countdown_cart_page_timer_wrapper_${e.id} essential_countdown_timer`;const s=document.createElement("div");a.append(s),t&&t.prepend(a),document.querySelector("#essential-cart-drawer-portal")&&(a.style.flex="0 0 auto"),$e(e);const c=!!n||q(a);Se(s,e,o,{sideCart:c,node:a}),c&&a.isConnected&&be(e,a),xe(a,e)}function k(){let e;const t=window?.Shopify?.routes?.root||"/";let n=document.querySelector(`form[action="${t}cart"]`);const o=document.querySelectorAll(".side-cart, cart-items-component .cart-items__wrapper"),r=document.querySelectorAll('#essential-cart-drawer-portal, [data-essential-cart-element="cart-drawer-content"]'),a=document.querySelector(".countdown-timer-side-cart");return n&&n.getAttribute("id")==="cart-notification-form"&&(n=null),a?e=a:r.length>0?e=r[r.length-1]:n?e=n:o.length>0&&(e=o[o.length-1]),e}function Ne(){let e;const t=window.location&&window.location.pathname.includes("/products/"),n=window.location&&window.location.pathname.includes("/collections/")&&!window.location.pathname.includes("/products/"),o=window.location&&window.location.pathname.includes("/password"),r=window.location&&window.location.pathname.includes("/cart");let a=document.querySelectorAll('form[action="/cart/add"]');const s=document.querySelector("#MainContent"),c=document.querySelector("main"),u=document.querySelector("form#contact_form"),w=document.querySelector(".essential-countdown-timer-placement"),_=s||c;if(a&&a.length===0){const i=document.querySelectorAll("form[action]");a=Array.from(i).filter(h=>h.getAttribute("action").includes("/cart/add"))}if(r){const i=window?.Shopify?.routes?.root||"/",h=document.querySelectorAll(`form[action="${i}cart"]`),g=h[h.length-1];g&&(e=g.parentNode)}const y=document.querySelectorAll("div.countdown-timer-block");let l=[];const p=(i,h,g,b)=>{if(i.type!==h||g&&i.timerPlacement==="custom"||b&&i.productTags&&i.productTags.length>0)return!1;if(i.showOnProducts&&i.showOnProducts.length!==0){const d=decodeURI(window.location.pathname),f=window.meta&&window.meta.product;if(!i.showOnProducts.find(T=>f&&f.gid?f.gid===T.id:typeof d.endsWith=="function"?d.endsWith(`products/${T.handle}`):d.includes(`products/${T.handle}`)))return!1}if(i.showOnProductsInCollections&&i.showOnProductsInCollections.length!==0){const d=x.productCollections||[];if(!i.showOnProductsInCollections.find(m=>{const T=Number(m.id.split("/").pop());return d.some(E=>E.id===T)}))return!1}return!(Y(i)||S(i)&&!X(i)||S(i)&&!Z(i))},$=(i,h,g)=>{if(i.type!==h||window.location&&window.location.pathname.includes("/products/")&&(i.timerPlacement==="on-collections"||i.timerPlacement==="all-collections")||g&&i.timerPlacement==="custom"||g&&i.timerPlacement==="password-page")return!1;if(i.showOnCollections&&i.showOnCollections.length!==0){const d=decodeURI(window.location.pathname);let f;if(Shopify.shop==="american-uncle-alpha.myshopify.com"||Shopify.shop==="89be57-2.myshopify.com"||Shopify.shop==="anbernicbrazil.myshopify.com"||Shopify.shop==="playr-fit-teamwear.myshopify.com"||new Date(i.createdAt).getTime()>1730369064e3?f=essentialCollectionId&&i.showOnCollections.find(m=>m.id.includes(essentialCollectionId)):f=i.showOnCollections.find(m=>d.includes(`collections/${m.handle}`)),!f)return!1}return!(Y(i)||S(i)&&!X(i)||S(i)&&!Z(i)||i.excludeOnCollections?.find(d=>{const f=Number(d.id.split("/").pop());return window.essentialCollectionId===f}))},A=(i,h,g)=>!(i.type!==h||g&&i.timerPlacement===""||i.timerPlacement&&i.timerPlacement!=="password-page"||Y(i)||S(i)&&!X(i)||S(i)&&!Z(i)),v=(i,h,g)=>!(i.type!==h||g&&i.timerPlacement==="custom");y&&y.length>0&&(l=Array.from(y).filter(i=>i&&i.getAttribute("countdown-timer-id")!=="")),H().then(async i=>{if(i&&!Array.isArray(i)&&i.length===0)return null;const h=i.filter(d=>d.locationType==="on-countries"?C?d.showInCountries?.includes(C):!1:!i.some(m=>m.locationType==="on-countries"&&m.type===d.type&&m.timerPlacement===d.timerPlacement&&C&&m.showInCountries?.includes(C)));h.forEach(d=>{if(d.translations&&d.translations.length>0){const f=d.translations.find(m=>m.locale===Shopify?.locale);f&&Object.assign(d,f)}});const g=h.filter(d=>d.type==="top-bar"),b=h.find(d=>d.type==="cart-page");if(g.forEach(d=>{d&&d.timerPlacement!=="custom"&&p(d,"top-bar")&&$(d,"top-bar")&&le(d)}),l.forEach(d=>{const f=d.getAttribute("countdown-timer-id"),m=h.find(T=>T.id===f&&T.type==="top-bar");m&&p(m,"top-bar")&&$(m,"top-bar")&&le(m,d)}),l=l.filter(d=>{const f=d.getAttribute("countdown-timer-id"),m=h.find(T=>T.id===f);return!!(!m||m&&m?.type!=="top-bar")}),l.forEach(d=>{const f=d.getAttribute("countdown-timer-id"),m=h.find(T=>T.id===f);m&&p(m,"product-page")&&ce(m,d,!0),m&&$(m,"landing-page")&&J(m,d),m&&m.type==="cart-page"&&P(m,d)}),l.length===0&&t&&(a&&a.length>0||w)){let d,f;w?f=w:f=a[a.length-1];const m=h.find(E=>E.productTags&&E.productTags.length>0);let T;if(m){const j=(window.essentialProductTags||[]).map(Q=>Q.toLowerCase());T=h.filter(Q=>Q.productTags.some(Me=>j.includes(Me.toLowerCase())))}if(T&&T.length>0?d=T.find(E=>p(E,"product-page",!0)):d=h.find(E=>p(E,"product-page",!0,!0)),d){if(Shopify?.theme?.name&&Shopify.theme.name.toLowerCase().includes("debutify")&&d.createdAt&&new Date(d.createdAt).getTime()>1698142755e3&&!w){const E=document.querySelector("form.product-single__form"),j=document.querySelector('product-form form[action="/cart/add"]');E?f=E:j&&(f=j)}ce(d,f)}}if(l.length===0&&n&&_){let d;const f=_;d=h.find(m=>$(m,"landing-page",!0)),d&&J(d,f,!1)}if(l.length===0&&o&&u){let d;const f=u;d=h.find(m=>A(m,"landing-page",!0)),d&&J(d,f)}if(l.length===0&&r){const d=h.find(f=>v(f,"cart-page",!0));e&&d&&P(d,e)}if(k()&&b&&!r){let d=k();if(d&&b.timerPlacement!=="custom"){P(b,d,!0);const f=new MutationObserver(()=>{if(window._essentialMovingTimer)return;const m=document.querySelector(`.countdown_cart_page_timer_wrapper_${b.id}`);if(m?.parentElement?.matches("#essential-cart-drawer-portal")){const T=k();T.matches("#essential-cart-drawer-portal")||(window._essentialMovingTimer=!0,m.remove(),P(b,T,!0),window._essentialMovingTimer=!1);return}!m&&k()&&P(b,k(),!0)});if(!window.sideCartObserver&&d){let m;d.parentNode.parentNode.parentNode.parentNode&&d.parentNode.parentNode.parentNode.parentNode.tagName!=="BODY"&&d.parentNode.parentNode.parentNode.parentNode.tagName!=="HTML"?m=d.parentNode.parentNode.parentNode.parentNode:d.parentNode.parentNode.parentNode&&d.parentNode.parentNode.parentNode.tagName!=="BODY"&&d.parentNode.parentNode.parentNode.tagName!=="HTML"?m=d.parentNode.parentNode.parentNode:d.parentNode.parentNode&&d.parentNode.parentNode.tagName!=="BODY"&&d.parentNode.parentNode.tagName!=="HTML"?m=d.parentNode.parentNode:m=d.parentNode,document.querySelector("#essential-cart-drawer-portal")&&(m=document.querySelector("#essential-cart-drawer-portal")),window.cartTimerObserver=f,f.observe(m,{childList:!0,subtree:!0}),window.sideCartObserver=!0}!window.sideCartSnippetObserver&&!document.querySelector(".countdown-timer-side-cart")&&window.Shopify?.shop==="xwsy3e-ik.myshopify.com"&&(new MutationObserver(()=>{const T=document.querySelector(".countdown-timer-side-cart"),E=T?.querySelector(`.countdown_cart_page_timer_wrapper_${b.id}`);T&&!E&&P(b,T,!0)}).observe(document.body,{childList:!0,subtree:!0}),window.sideCartSnippetObserver=!0)}}if(b&&!r&&b.timerPlacement!=="custom"&&!window.sideCartSnippetObserver&&window.Shopify?.shop==="smartsleep-onlineshop.myshopify.com"&&(window.sideCartSnippetObserver=!0,new MutationObserver(()=>{const d=document.querySelector(".countdown-timer-side-cart");d&&!d.querySelector(`.countdown_cart_page_timer_wrapper_${b.id}`)&&P(b,d,!0)}).observe(document.body,{childList:!0,subtree:!0})),!k()&&!r&&b)try{timerSession=window.localStorage.getItem(`essentialCountdownTimer-${b.id}`),timerSession&&P(b,!1)}catch(d){console.log(d)}})}function Y(e){if(e.startDate&&e.timerType!=="fixedMinutes"){const t=Number(new Date().getTime()),n=Number(L(e.startDate).getTime()),o=Number(L(e.endDate).getTime()),r=S(e)&&e.startType==="today"?n:Number(new Date(e.startDate).getTime());return!(S(e)&&e.startType==="today"&&n>o||t>=r)}return!1}function S(e){return e.timerType==="recurring"}function Z(e){if(e.onceItEnds==="do-nothing"||e.onceItEnds==="custom-title")return!0;const t=Number(new Date().getTime()),n=Number(L(e.startDate).getTime()),o=Number(L(e.endDate).getTime());return n<o?n<t&&t<o:new Date(e.updatedAt).getTime()>1735570161e3?n<t||t<o:n<t&&t<o+24*60*60*1e3}function X(e){const t=new Date().getDay();return e.recurringDays&&e.recurringDays.length>0?e.recurringDays.includes(t):!0}function L(e){const t=new Date,n=new Date(e).getHours(),o=new Date(e).getMinutes(),r=new Date(e).getSeconds();return t.setHours(n),t.setMinutes(o),t.setSeconds(r),t}function Be(e,t,n){return e.replace(t,n.outerHTML)}const Ee=new Set(["B","STRONG","I","EM","U","S","BR","SPAN","P","SMALL","SUP","SUB","DIV","FONT"]),ue=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","LINK","META","IMG","SVG","MATH","BASE","FORM","INPUT","TEMPLATE","AUDIO","VIDEO"]),Ae=new RegExp(`<\\s*/?\\s*(${Array.from(ue).join("|")})\\b`,"i"),ve=/<[^>]+\son\w+\s*=/i,Ie=/javascript\s*:/i;function Oe(e){return Ae.test(e)||ve.test(e)||Ie.test(e)}function pe(e,t){const n=t||new Set;return e==null?!1:typeof e=="string"?Oe(e):typeof e!="object"||n.has(e)?!1:(n.add(e),Object.keys(e).some(o=>pe(e[o],n)))}function M(e){if(typeof e!="string")return"";const t=e.trim();return t&&(!t.includes(":")||/^(https?|mailto|tel):/i.test(t))?t:""}function me(e){return Array.isArray(e)?e.filter(t=>pe(t)?(console.warn("[essential-countdown-timer] timer not rendered: config contains executable markup",t&&t.id),!1):!0):e}function Pe(e){const t=document.createElement("template");t.innerHTML=String(e??"");const n=o=>{Array.from(o.childNodes).forEach(r=>{if(r.nodeType!==Node.TEXT_NODE){if(r.nodeType!==Node.ELEMENT_NODE){r.remove();return}if(ue.has(r.tagName)){r.remove();return}if(!Ee.has(r.tagName)){n(r),r.replaceWith(...Array.from(r.childNodes));return}Array.from(r.attributes).forEach(a=>{a.name.toLowerCase()==="style"&&!/expression|url\s*\(|javascript:|behaviour|behavior/i.test(a.value)||r.removeAttribute(a.name)}),n(r)}})};return n(t.content),t.content}function De(e,t,n){const o="{timer}",r=Pe(t),a=document.createTreeWalker(r,NodeFilter.SHOW_TEXT);let s;for(;s=a.nextNode();){const c=s.nodeValue.indexOf(o);if(c===-1)continue;const u=s.splitText(c);u.nodeValue=u.nodeValue.slice(o.length),u.parentNode.insertBefore(n,u);break}e.append(r)}fe(),Ne()})();function essentialCountdownCloseAnnouncementBar(C,x){const N=document.querySelector(`.countdown_annoucement_bar_wrapper_${C}`);if(N){N.parentNode.removeChild(N);try{window.localStorage.setItem("countdownTimerAnnoucementBarClosed",JSON.stringify({value:!0,id:C,updatedAt:x}))}catch(H){console.log(H)}}}function essentialCountdownCloseAnnouncementBarOnClick(C,x){!C.target.closest("button")&&x&&(window.location.href=x)}async function getCartEssentialApps(){return await fetch(window?.Shopify?.routes?.root+"cart.js",{headers:{"Content-Type":"application/json"}}).then(x=>x.json()).then(x=>x).catch(x=>{console.error("Error:",x)})}function clearCartEssentialApps(C){fetch(window?.Shopify?.routes?.root+"cart/clear.js",{method:"POST",headers:{"Content-Type":"application/json"}}).then(()=>{try{window.localStorage.removeItem(`essentialCountdownTimer-${C.id}`)}catch(N){console.log(N)}(window.location&&window.location.pathname.includes("/cart")||window.cartTimerObserver)&&location.reload()}).catch(x=>{console.error("Error:",x)})}
