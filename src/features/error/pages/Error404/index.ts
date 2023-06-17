import './style.css'

export const Error404 = {
  render: async () => {
    const view = /*html*/ `
            <div id="error404_container">
                <section class="section">
                    <h1> 404 Error </h1>
                </section>
            </div>
        `
    return view
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterRender: async () => {},
}
