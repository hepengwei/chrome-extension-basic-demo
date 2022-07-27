// 监听background页面发来的消息
chrome.runtime.onMessage.addListener((request) => {
  console.log("接收到background消息：", request);
  switch (request.todo) {
    case "addLog":
      showAddLogModal(request.data);
      break;
    case "closeModal":
      closeAddLogModal();
      break;
  }
});

// 点击保存按钮的回调
function onSave() {
  const inputText = $("#input").val();
  if (!inputText) {
    alert("请先输入内容");
    return;
  }
  // 在content_scripts中只能使用部分API，所以将输入的内容交给background页面处理
  chrome.runtime.sendMessage(chrome.runtime.id, {
    todo: "saveLog",
    data: inputText,
  });
}

// 打开添加日志弹窗
function showAddLogModal(text) {
  // 获取外部完整的图片URL
  const image = chrome.runtime.getURL("images/icon.png");
  const mask =
    '<div id="mask" style="position: fixed;top: 0;bottom: 0;left: 0;right: 0;width: 100%;height: 100%;background-color: #333333;opacity: 0.8;z-index:9998" />';
  const addLogModal = `<div id="modal" style="position: fixed;top: 50%;left: 50%;width: 400px;height: 200px;margin-left: -200px;margin-top: -100px;background-color: #ffffff;border-radius: 8px;z-index: 9999;display: flex;flex-direction: column;align-items: center;padding: 20px"><img src="${image}" alt="" width="60" height="60" style="border-radius: 4px"><input id="input" placeholder="请输入" required value="${text}" style="width: 320px;height: 46px;margin-top: 20px;border: 1px solid #000;border-radius: 4px;padding: 0 6px"><button id="save" style="width: 320px;height: 34px;margin-top: 20px;cursor: pointer;">保存</button></div>`;
  $(mask).appendTo(document.body);
  $(addLogModal).appendTo(document.body);
  $("#mask").click(closeAddLogModal);
  $("#save").click(onSave);
}

// 关闭添加日志弹窗
function closeAddLogModal() {
  $("#modal").remove();
  $("#mask").remove();
}
