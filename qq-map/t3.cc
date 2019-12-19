//生成Catmull_Rom Spline算法顶点
osg::Vec3 Catmull_Rom_SplinePoint_new(float u, osg::ref_ptr<osg::Vec3Array> subconctrl_P)
{
    float f0, f1, f2, f3;
    osg::Vec3 vert;
    f0 = (-0.5)*pow(u, 3) + pow(u, 2) + (-0.5*u);
    f1 = 1.5*pow(u, 3) - 2.5*pow(u, 2) + 1;
    f2 = (-1.5)*pow(u, 3) + 2.0*pow(u, 2) + 0.5*u;
    f3 = 0.5*pow(u, 3) - 0.5*pow(u, 2);
    vert = subconctrl_P->at(0)*f0 + subconctrl_P->at(1)*f1 + subconctrl_P->at(2)*f2 + subconctrl_P->at(3)*f3;
    return vert;
}

//生成Catmull_Rom Spline样条线顶点,过端点
osg::ref_ptr<osg::Vec3Array> Catmull_Rom_SplinePoints_new(osg::ref_ptr<osg::Vec3Array> conctrl_P, int Unum = 10)
{
    osg::ref_ptr<osg::Vec3Array> C_Line_vertices = new osg::Vec3Array;
    osg::ref_ptr<osg::Vec3Array> New_conctrl_P = new osg::Vec3Array;
    auto pointsnum = conctrl_P->size();
    auto P0 = conctrl_P->at(0) * 2 - conctrl_P->at(1);
    New_conctrl_P->push_back(P0);
    auto Pn = conctrl_P->at(pointsnum - 1) * 2 - conctrl_P->at(pointsnum - 2);
    for (int i = 0; i < pointsnum; i++)
    {
        New_conctrl_P->push_back(conctrl_P->at(i));
    }
    New_conctrl_P->push_back(Pn);
    pointsnum += 2;
    for (int i = 0; i < pointsnum; i++)
    {
        if (i < pointsnum - 3)
        {
            osg::ref_ptr<osg::Vec3Array> subcontrl = new osg::Vec3Array;
            subcontrl->push_back(New_conctrl_P->at(i));
            subcontrl->push_back(New_conctrl_P->at(i + 1));
            subcontrl->push_back(New_conctrl_P->at(i + 2));
            subcontrl->push_back(New_conctrl_P->at(i + 3));
            float deltaU = 1.0 / float(Unum);
            for (int j = 0; j < Unum; j++)
            {
                auto Uu = j*deltaU;
                auto tempp = Catmull_Rom_SplinePoint_new(Uu, subcontrl);
                C_Line_vertices->push_back(tempp);
            }
        }

    }
    return C_Line_vertices;
}
