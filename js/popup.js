$(function () {
  showHello();
  showlogList();
});

// 使用国际化语言展示Hello World(这里为了始终显示英文，所以_locales文件夹中的helloWorld中英文设置的一样)
function showHello() {
  const hello = chrome.i18n.getMessage("helloWorld");
  $(".hello")[0]?.append(hello);
}

// 展示日志列表
function showlogList() {
  // 获取日志数据
  chrome.storage.sync.get("logs").then((data) => {
    if (data?.logs?.length) {
      let innerHtml = '<p class="title">日志列表</p>';
      data.logs.forEach((log) => {
        innerHtml += `<div class="log" data-log="${log}"><div class="dot"></div><p>${log}</p><div class="btn"><button id="deleteBtn" data-log="${log}">X</button></div></div>`;
      });
      $(innerHtml).appendTo($("#logList"));
      $("#logList").click(onClickList);
    } else {
      showNoLog();
    }
  });
}

// 展示暂无日志的提示
function showNoLog() {
  const innerHtml =
    '<span>暂无日志，您可以去<a id="react" href="https://react.docschina.org/">React中文官网</a>页面选中文字并点击鼠标右键添加日志</span>';
  $(innerHtml).appendTo($("#logList"));
  $("#react").click(() => {
    chrome.tabs.create({ url: `https://react.docschina.org/` });
  });
}

// 点击日志列表的回调
function onClickList(e) {
  const { target } = e;
  if (target?.dataset?.log) {
    const { log } = target.dataset;
    deleteLog(log, (newLogs) => {
      // 更改插件图标上徽标文字
      chrome.action.setBadgeText({text: newLogs.length ? newLogs.length.toString() : ""});
      // 修改页面显示
      const children = $("#logList").children(".log");
      for (let child of children) {
        if (child?.dataset?.log === log) {
          child.remove();
          if (children.length === 1) {
            $(".title")[0]?.remove();
            showNoLog();
          }
          return;
        }
      }
    });
  }
}

// 删除日志
function deleteLog(value, callback) {
  // 获取日志数据
  chrome.storage.sync.get("logs").then((data) => {
    if (data?.logs?.length) {
      const newLogs = data.logs.filter((log) => log !== value);
      // 重新保存日志数据
      chrome.storage.sync.set({ logs: newLogs }).then(() => {
        callback(newLogs);
      });
    }
  });
}
