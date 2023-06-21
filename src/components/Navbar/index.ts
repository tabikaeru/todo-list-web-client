import './index.css'

export const Navbar = () => ({
  render: async () => {
    const view = /*html*/ `
             <nav class="navbar" role="navigation" aria-label="main navigation">
                <div class="container">
                    <div class="navbar-brand">
                        <a class="navbar-item" href="/#/">
                            <p>Todo List App</p>
                        </a>
                    </div>
                </div>
            </nav>
        `
    return view
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterRender: async () => {},
})
