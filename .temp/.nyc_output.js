@keyframes loadingPB_0 { 
  0% { width: 0%; }
  100% { width: 100%; }
}
.lpb { animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45); animation-fill-mode: both; background: rgb(239, 83, 78); height: 3px; left: 0px; top: 0px; width: 0%; z-index: 9999; position: fixed; animation-name: loadingPB_0; animation-duration: 2000ms; animation-play-state: running; }
.lpb::after { display: block; position: absolute; content: ""; right: 0px; width: 100px; height: 100%; opacity: 0.5; }
