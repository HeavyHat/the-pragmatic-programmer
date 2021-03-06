import React from 'react'


function Footer() {
    return (<footer class="footer footer-default" >
      <div class="container">
        <nav class="float-left">
          <ul>
            <li>
              <a href="https://www.creative-tim.com/">
                  Creative Tim
              </a>
            </li>
          </ul>
        </nav>
        <div class="copyright float-right">
            &copy;
            <script>
                document.write(new Date().getFullYear())
            </script>, made with <i class="material-icons">favorite</i> by
            <a href="https://www.creative-tim.com/" target="blank">Creative Tim</a> for a better web.
        </div>
      </div>
    </footer>);
}

export default Footer;
