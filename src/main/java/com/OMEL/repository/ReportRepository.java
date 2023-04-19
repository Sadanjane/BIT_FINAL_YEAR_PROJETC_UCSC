package com.OMEL.repository;

import com.OMEL.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReportRepository extends JpaRepository<Supplier , Integer> {

    @Query(value = "SELECT new Supplier(s.companyfullname , s.areasamount) FROM Supplier s ")
    List<Supplier> areusAmountFindAll();

    /*expense report by suplierpayment table */
    @Query(value = "SELECT month(sp.addeddate) , year(sp.addeddate)  , sum(sp.paidamount) FROM omelstore.supplierpayment as sp where date(sp.addeddate) between ?1 and ?2 group by year(sp.addeddate);" , nativeQuery = true)
    List yearlyExpencess(String sdate , String edate);

    @Query(value = "SELECT year(sp.addeddate) , monthname(sp.addeddate) , sum(sp.paidamount) FROM omelstore.supplierpayment as sp where date(sp.addeddate) between ?1 and ?2 group by month(sp.addeddate);" , nativeQuery = true)
    List monthlyExpencess(String sdate , String edate);

    @Query(value = "SELECT year(sp.addeddate) , week(sp.addeddate)  , sum(sp.paidamount) FROM omelstore.supplierpayment as sp where date(sp.addeddate) between ?1 and ?2 group by week(sp.addeddate);" , nativeQuery = true)
    List weeklyExpencess(String sdate , String edate);

    @Query(value = "SELECT year(sp.addeddate) , date(sp.addeddate) , sum(sp.paidamount) FROM omelstore.supplierpayment as sp where date(sp.addeddate) between ?1 and ?2 group by date(sp.addeddate);" , nativeQuery = true)
    List dailyExpencess(String sdate , String edate);

    /*end of expense report*/

    /* one month expense*/
    @Query(value = "SELECT sum(sp.paidamount) FROM omelstore.supplierpayment as sp where month(sp.addeddate) = month(now()) and year(sp.addeddate) = year(now()) ;" , nativeQuery = true)
    List thismonthExpenses();

    /*get current month income*/
    @Query(value="SELECT sum(i.netamount) FROM omelstore.invoice as i where month(i.invoicedatetime)= month(now()) and year(i.invoicedatetime)=year(now());" , nativeQuery = true)
    List thisMonthIncome();

    /*get all ordered orders*/
    @Query(value = "SELECT count(*) FROM omelstore.customerorder;" , nativeQuery = true)
    List orderCount();

    /*get all active customer count*/
    @Query(value = "SELECT count(*) FROM omelstore.customer where customerstatus_id1 = '1';" , nativeQuery = true)
    List activeCustomers();

    //most selling itms for dashboard chart for 6 month
    @Query(value = "SELECT itm.itemname ,sum(it.qty) FROM omelstore.invoice_has_item as it ,omelstore.invoice as inv ,omelstore.item as itm where it.invoice_id = inv.id and it.item_id = itm.id group by date(inv.invoicedatetime), (itm.itemname) and date(inv.invoicedatetime)> date(now() - 180)" , nativeQuery = true)
    List mostsellingitems();

    /*and date(inv.invoicedatetime)> date(now() - 180*/

    /*most selling itms for dashboard chart for 6 month*//*
    @Query(value = "SELECT itm.itemname ,sum(it.qty) FROM omelstore.invoice_has_item as it ,omelstore.invoice as inv ,\n" +
            "    omelstore.item as itm where it.invoice_id = inv.id and it.item_id = itm.id and inv.invoicedatetime <= (curdate() - interval 180 day) " +
            "group by date(inv.invoicedatetime), (itm.itemname);" , nativeQuery = true)
    List mostsellingitems();*/

    /*income report by invoice table*/

    @Query(value = "SELECT year(i.invoicedatetime) ,date(i.invoicedatetime) , sum(i.netamount) FROM omelstore.invoice as i " +
            "where date(i.invoicedatetime) between ?1 and ?2 group by date(i.invoicedatetime);" , nativeQuery = true)
    List dailyIncome(String sdate , String edate);

    @Query(value = "SELECT year(i.invoicedatetime), week(i.invoicedatetime) , sum(i.netamount) " +
            "FROM omelstore.invoice as i where date(i.invoicedatetime) between ?1 and ?2 " +
            "group by week(i.invoicedatetime);" , nativeQuery = true)
    List weeklyIncome(String sdate , String edate);

    @Query(value = "SELECT year(i.invoicedatetime), monthname(i.invoicedatetime)  , sum(i.netamount) " +
            "FROM omelstore.invoice as i where date(i.invoicedatetime) between ?1 and ?2 " +
            "group by month(i.invoicedatetime);" , nativeQuery = true)
    List monthlyIncome(String sdate , String edate);

    @Query(value = "SELECT month(i.invoicedatetime), year(i.invoicedatetime)  , sum(i.netamount) FROM omelstore.invoice as i where date(i.invoicedatetime) between ?1 and ?2 group by year(i.invoicedatetime);" , nativeQuery = true)
    List yearlyIncome(String sdate , String edate);

    /*items sale report*/
    @Query(value = "SELECT year(inv.invoicedatetime) , date(inv.invoicedatetime) , week(inv.invoicedatetime) , " +
            " sum(it.qty) , itm.itemname\n" +
            "FROM omelstore.invoice_has_item as it ,omelstore.invoice as inv , omelstore.item as itm " +
            "where itm.itemname=:itemname \n" +
            "and it.invoice_id = inv.id \n" +
            "and it.item_id = itm.id and date(inv.invoicedatetime) between :sdate and :edate \n" +
            "group by date(inv.invoicedatetime), (itm.itemname);" , nativeQuery = true)
    List dailyItemSale(@Param("itemname")String itemname ,@Param("sdate") String sdate ,@Param("edate") String edate);

    @Query(value = "SELECT year(inv.invoicedatetime) , week(inv.invoicedatetime) , date(inv.invoicedatetime) ," +
            " sum(it.qty) ,itm.itemname  \n" +
            "FROM omelstore.invoice_has_item as it , \n" +
            "omelstore.invoice as inv , \n" +
            "omelstore.item as itm \n" +
            "where itm.itemname= ?1 and it.invoice_id = inv.id \n" +
            "and \n" +
            "it.item_id = itm.id \n" +
            "and\n" +
            "date(inv.invoicedatetime) \n" +
            "between ?2 and ?3 \n" +
            "group by week(inv.invoicedatetime), (itm.itemname);" , nativeQuery = true)
    List weeklySale(String itemname , String sdate , String edate);

    @Query(value = "SELECT year(inv.invoicedatetime) , monthname(inv.invoicedatetime) , date(inv.invoicedatetime)  , sum(it.qty), itm.itemname\n" +
            "FROM omelstore.invoice_has_item as it , \n" +
            "omelstore.invoice as inv , \n" +
            "omelstore.item as itm \n" +
            "where itm.itemname= ?1 and it.invoice_id = inv.id \n" +
            "and \n" +
            "it.item_id = itm.id \n" +
            "and\n" +
            "date(inv.invoicedatetime) \n" +
            "between ?2 and ?3 \n" +
            "group by month(inv.invoicedatetime), (itm.itemname);" , nativeQuery = true)
    List monthlySale(String itemname ,  String sdate , String edate);

    @Query(value = "SELECT year(inv.invoicedatetime) , month(inv.invoicedatetime) , date(inv.invoicedatetime) , sum(it.qty) , itm.itemname \n" +
            "FROM omelstore.invoice_has_item as it , \n" +
            "omelstore.invoice as inv , \n" +
            "omelstore.item as itm \n" +
            "where itm.itemname= ?1 and it.invoice_id = inv.id \n" +
            "and \n" +
            "it.item_id = itm.id \n" +
            "and\n" +
            "date(inv.invoicedatetime) \n" +
            "between ?2 and ?3 \n" +
            "group by year(inv.invoicedatetime), (itm.itemname);" , nativeQuery = true)
    List yearlySale(String itemname , String sdate , String edate);

    /*NOTIFICATIONS*/

    //expiring soom cheques
    @Query(value = "SELECT s.companyfullname ,sp.billno , sp.paidamount , sp.checkdate FROM omelstore.supplierpayment as sp , omelstore.supplier as s " +
            "where sp.checkdate >= curdate() and (date(sp.checkdate) + interval 5 day) " +
            "and sp.supplier_id = s.id group by s.companyfullname order by sp.checkdate asc; ", nativeQuery = true)
    List expireCheques();

    @Query(value = "SELECT i.itemname, b.batchnumber, b.availableqty FROM omelstore.batch AS b,omelstore.item AS i WHERE b.expiredate >= 5 AND (b.expiredate + INTERVAL 30 DAY)\n" +
            "group by i.itemname and b.batchnumber\n" +
            "ORDER BY b.expiredate DESC" , nativeQuery = true)
    List expiringitemsByBatch();

}
