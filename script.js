
function makeICS(data){
  const pad=n=>String(n).padStart(2,'0');
  const dt=new Date(data.date+'T'+data.time);
  const dtend=new Date(dt.getTime()+60*60*1000);
  const fmt=d=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//LE LAW OFFICE//Booking//EN','BEGIN:VEVENT','UID:'+Math.random().toString(36).slice(2),
    'DTSTAMP:'+fmt(new Date()),'DTSTART:'+fmt(dt),'DTEND:'+fmt(dtend),'SUMMARY:Consultation - LE LAW OFFICE',
    'DESCRIPTION:'+(data.service||'')+' with '+(data.name||'')+' ('+(data.email||'')+')',
    'LOCATION:9131 Keele Street, Suite A4, Vaughan, ON, L4K 0G7','END:VEVENT','END:VCALENDAR'].join('\r\n');
}
function encode(data){return Object.keys(data).map(k=>encodeURIComponent(k)+'='+encodeURIComponent(data[k])).join('&');}
document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('reservation-form'); const alertBox=document.getElementById('reservation-alert'); if(!form) return;
  form.addEventListener('submit', async (e)=>{
    e.preventDefault(); const fd=new FormData(form); if(fd.get('bot-field')) return;
    const obj=Object.fromEntries(fd.entries());
    if(!obj.name||!obj.email||!obj.date||!obj.time||!obj.service){alertBox.textContent='Please fill all required fields.';return;}
    const ics=makeICS(obj); const blob=new Blob([ics],{type:'text/calendar'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='LE-Law-Consultation.ics'; a.click();
    try{ await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encode(Object.assign({'form-name':form.getAttribute('name')},obj))});
      window.location=form.getAttribute('action')||'/thank-you.html';
    }catch(err){ alertBox.textContent='Submission failed. Please try again or email info@lelawoffice.ca'; }
  });
});
