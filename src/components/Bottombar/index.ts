import './index.css'

export const Bottombar = {
  render: async () => {
    const view = /*html*/ `
        <footer class="footer">
            <div class="content has-text-centered">
                <p>
                    ©︎ 2023 morioka
                </p>
            </div>
        </footer>
        `
    return view
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  afterRender: async () => {},
}
