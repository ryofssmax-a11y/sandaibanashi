(function () {
  var works = window.SANDAIBANASHI_WORKS;
  var countEl = document.getElementById("fact-count");
  var periodEl = document.getElementById("fact-period");
  var latestEl = document.getElementById("fact-latest");
  var monthEl = document.getElementById("month");
  var queryEl = document.getElementById("query");
  var shownEl = document.getElementById("shown");
  var listEl = document.getElementById("list");

  if (!Array.isArray(works) || !countEl || !listEl) return;

  function shortStamp(postedAt) {
    var bits = postedAt.split(" ");
    var date = bits[0].split("-");
    return Number(date[1]) + "/" + Number(date[2]) + " " + bits[1];
  }

  var times = works.map(function (work) { return work.postedAt; }).sort();
  var oldest = times[0];
  var newestWork = works.reduce(function (latest, work) {
    return work.postedAt > latest.postedAt ? work : latest;
  }, works[0]);

  countEl.textContent = works.length + "作品（投稿記録で確認できた分）";
  periodEl.textContent = oldest.slice(0, 10) + " 〜 " + times[times.length - 1].slice(0, 10) + "（JST）";
  latestEl.textContent = "『" + newestWork.title + "』 " + shortStamp(newestWork.postedAt);

  var months = [];
  works.forEach(function (work) {
    var key = work.postedAt.slice(0, 7);
    if (months.indexOf(key) === -1) months.push(key);
  });
  months.sort().reverse();
  months.forEach(function (key) {
    var option = document.createElement("option");
    var parts = key.split("-");
    option.value = key;
    option.textContent = parts[0] + "年" + Number(parts[1]) + "月";
    monthEl.appendChild(option);
  });

  function render() {
    var q = queryEl.value;
    var month = monthEl.value;
    var visible = works.filter(function (work) {
      if (month !== "all" && work.postedAt.slice(0, 7) !== month) return false;
      if (q === "") return true;
      return (work.title + work.themes + work.honka + work.opening).indexOf(q) !== -1;
    });

    shownEl.textContent = visible.length + "件を表示中";
    listEl.replaceChildren();

    if (visible.length === 0) {
      var empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "該当する作品はありません。";
      listEl.appendChild(empty);
      return;
    }

    visible.forEach(function (work) {
      var article = document.createElement("article");
      article.className = "work";

      var when = document.createElement("p");
      when.className = "when";
      when.textContent = work.postedAt + " JST" + (work.note ? "（" + work.note + "）" : "");

      var heading = document.createElement("h3");
      heading.textContent = "『" + work.title + "』";

      var meta = document.createElement("p");
      meta.className = "meta";
      meta.textContent = "お題：" + work.themes + (work.honka ? " ／ 本歌：" + work.honka : "");

      article.append(when, heading, meta);

      if (work.opening) {
        var opening = document.createElement("p");
        opening.className = "opening";
        opening.textContent = work.opening;
        article.appendChild(opening);
      } else {
        var missing = document.createElement("p");
        missing.className = "missing";
        missing.textContent = "本文の冒頭は記録にないため載せていません。";
        article.appendChild(missing);
      }

      if (/^\d+$/.test(work.statusId)) {
        var link = document.createElement("a");
        link.href = "https://x.com/ryo_miu/status/" + work.statusId;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Xで全文を読む";
        article.appendChild(link);
      }

      listEl.appendChild(article);
    });
  }

  queryEl.addEventListener("input", render);
  monthEl.addEventListener("change", render);
  render();
})();
