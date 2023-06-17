import './index.css'

export const Navbar = {
  render: async () => {
    const view = /*html*/ `
             <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/#/">
                            <p>Todo List App</p>
                        </a>

                        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>

                    <div id="navbarBasicExample" class="navbar-menu is-active" aria-expanded="false">
                        <div class="navbar-start">
                            <a class="navbar-item" href="/#/">
                                Home
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `
    return view
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterRender: async () => {},
}
