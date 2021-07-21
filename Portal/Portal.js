(() => {
  'use strict'
  kintone.events.on('portal.show', async(event) => {
    
    // タブ
    const tab = document.createElement('div')
    tab.classList.add('tabs')

    const button_original = document.createElement('button')
    button_original.id = 'button_original'
    button_original.textContent = 'Portal'
    button_original.classList.add('active')
    button_original.onclick = (() => {
      button_original.classList.add('active')
      button_apps.classList.remove('active')
      document.getElementsByClassName('ocean-portal-body')[0].classList.add('tab-show')
      document.getElementsByClassName('ocean-portal-body')[0].classList.remove('tab-hidden')
      document.getElementsByClassName('links')[0].classList.remove('tab-show')
      document.getElementsByClassName('links')[0].classList.add('tab-hidden')
    })
    tab.appendChild(button_original)
    const button_apps = document.createElement('button')
    button_apps.id = 'button_apps'
    button_apps.textContent = 'Apps'
    button_apps.classList.add('notactive')
    button_apps.onclick = (() => {
      button_original.classList.remove('active')
      button_apps.classList.add('active')
      document.getElementsByClassName('ocean-portal-body')[0].classList.remove('tab-show')
      document.getElementsByClassName('ocean-portal-body')[0].classList.add('tab-hidden')
      document.getElementsByClassName('links')[0].classList.add('tab-show')
      document.getElementsByClassName('links')[0].classList.remove('tab-hidden')
    })
    tab.appendChild(button_apps)
    kintone.portal.getContentSpaceElement().appendChild(tab)

    // アプリ一覧
    kintone.api(kintone.api.url('/k/v1/apps.json', true), 'GET', {}).then(async(resp) => {
      const apps = resp.apps
      const all_spaces = []
      await resp.apps.forEach((app) => {
        const spaceId = app.spaceId ? app.spaceId.toString() : 'nospace'
        all_spaces.push(spaceId)
      })
      const spaces = all_spaces.filter((x, i, self) => self.indexOf(x) === i)

      const links = document.createElement('div')
      links.classList.add('links')
      links.classList.add('tab-hidden')
      const applistwrap = document.createElement('div')
      applistwrap.classList.add('applistwrap')

      spaces.forEach(async(spaceId) => {
        const applist = document.createElement('div')
        applist.classList.add('applist')
        const space_name = spaceId !== 'nospace' ? await kintone.api(kintone.api.url('/k/v1/space.json', true), 'GET', {id: spaceId}).then((resp) => resp.name) : 'スペースなし'
        const spaceNameArea = document.createElement('div')
        spaceNameArea.classList.add('space-name-area')
        spaceNameArea.textContent = space_name
        applist.appendChild(spaceNameArea)
        apps.forEach((app) => {
          const applink = document.createElement('a')
          applink.classList.add('applink')
          if (spaceId === app.spaceId || spaceId === 'nospace' && !app.spaceId) {
            applink.text = app.name
            applink.href = `https://{サブドメイン名}.cybozu.com/k/${app.appId}/`
            applist.appendChild(applink)
          }
        })

        applistwrap.appendChild(applist)
      })
      
      links.appendChild(applistwrap)
      const kintonePortalContentSpace = document.getElementsByClassName('kintone-portal-content-space')
      kintonePortalContentSpace[0].appendChild(links)
      return apps
    })
    return event
  })
})()