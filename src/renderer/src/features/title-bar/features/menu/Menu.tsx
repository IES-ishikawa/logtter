import { DisplayMenu, EditMenu, FileMenu, HelpMenu } from './features'

export function Menu(): JSX.Element {
  return (
    <>
      <FileMenu />
      <EditMenu />
      <DisplayMenu />
      <HelpMenu />
    </>
  )
}
